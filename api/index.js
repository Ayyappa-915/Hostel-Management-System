require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const cron = require('node-cron');
const path = require('path');

const app = express();
const PORT = process.env.port;
const dburl = process.env.mongodb_compass_url;
const atlasurl = process.env.mongodb_atlas_url;
const admin_username = process.env.admin_username;
const admin_password = process.env.admin_password;


app.use(express.json());
app.use(session({
  secret: 'hostelSecretKey123',
  resave: false,
  saveUninitialized: false,
  
  cookie: {
    maxAge: 30 * 60 * 1000 
  }
}));

// ---------------------- Connect to MongoDB ----------------------
mongoose.connect(atlasurl)
  .then(() => {
    console.log('MongoDB connected');
    create_admins(admin_username,admin_password);
  })
  .catch(err => console.error('MongoDB connection error:', err));

  
// ---------------------- Schemas & Models ------------------------
const Admin = mongoose.model('hosteladmins', new mongoose.Schema({
  uname: String,
  pwd: String
}));

create_admins = (admin_username,admin_password) =>{
  Admin.findOne({uname:admin_username , pwd:admin_password})
  .then((record)=>{
    if(record)
    {
      return ;
    }
    else
    {
      const new_admin = new Admin({uname:admin_username,pwd:admin_password});
      return new_admin.save();
    }
  })
  .catch((error)=>{
    console.log(error)
  })
}

const students = mongoose.model('students', new mongoose.Schema({
  fname: String,
  lname: String,
  gender: String,
  dob: String,
  stid: String,
  phno: String,
  email: String,
  pwd: String,
  address: String
}));

const Rooms = mongoose.model('Room', new mongoose.Schema({
  roomnumber: Number,
  floor: Number,
  capacity: Number,
  available: Number,
  type: String,
  cool: String,
  occupy: String
}));

const stud_rooms = mongoose.model('Room Allocation', new mongoose.Schema({
  roomnumber: Number,
  floor: Number,
  stid: String,
  allocated_date : Date,
  total_amount:Number,
  paid_amount:Number,
  due_amount : Number
}));

const Fee = mongoose.model('Fee', new mongoose.Schema({
  stid: String,
  roomnumber: Number,
  month: Number,
  year: Number,
  amount: Number,
  status: {
    type: String,
    enum: ['due', 'paid'],
    default: 'due'
  },
  generatedOn: { type: Date, default: Date.now }
}));

// -------------------- Middleware ---------------------

const protectAndNoCache = (req, res, next) => {
  if (req.session && (req.session.admin || req.session.student)) {
    res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');
    return next();
  }
  return res.redirect('/');
};

const protectedPages = [
  '/admin_dashboard.html', '/add_room.html', '/allocated_room.html',
  '/non_allocated_room.html', '/room_allocation.html', '/room_deallocation.html',
  '/room_details.html', '/generated_fee.html', '/fee_details.html',
  '/student_details.html', '/stu_registration.html', '/student_dashboard.html',
  '/stud_allocated_room_details.html', '/stud_fee_details.html',
  '/stud_nonallocated_room_details.html', '/stud_room_details.html',
  '/stud_student_details.html','/fee_payment.html'
];

protectedPages.forEach(page => app.get(page, protectAndNoCache));

// -------------------- Admin Routes ---------------------
app.post('/admin-login', (req, res) => {
  const { uname, pwd } = req.body;
  Admin.findOne({ uname })
    .then(admin => {
      if (!admin) return res.json({ message: 'Admin does not exist', done: false });
      if (admin.pwd !== pwd) return res.json({ message: 'Wrong password', done: false });

      req.session.admin = { uname: admin.uname };
      res.json({ done: true, message: 'Login successful' });
    })
    .catch(err => {
      console.error('Login error:', err);
      res.json({ message: 'Login failed', done: false });
    });
});

app.post('/admin-logout', (req, res) => {
  if (req.session.admin) {
    req.session.destroy(err => {
      if (err) return res.json({ message: 'Logout error', done: false });
      res.clearCookie('connect.sid');
      res.json({ done: true, message: 'Logout successful' });
    });
  } else {
    res.json({ done: false, message: 'No active session' });
    return res.redirect('/')
  }
});

// ----------------- Student Registration ----------------
app.post('/stu_registration', protectAndNoCache, (req, res) => {
  const { fname, lname, gender, dob, stid, phno, email, address } = req.body;

  students.findOne({ stid })
    .then(existing => {
      if (existing) return res.json({ message: 'Student already registered', done: false });

      const new_student = new students({ fname, lname, gender, dob, stid, phno, email, address });
      return new_student.save();
    })
    .then(saved => {
      if (saved) res.json({ message: 'Student successfully registered', done: true });
    })
    .catch(err => {
      console.error('Registration error:', err);
      res.json({ message: 'Registration failed', done: false });
    });
});

// ------------------- Room Management -------------------
app.post('/add_room', protectAndNoCache, (req, res) => {
  const { roomnumber, floor, capacity, available, type, cool, occupy } = req.body;

  Rooms.findOne({ roomnumber })
    .then(existing => {
      if (existing) return res.json({ message: 'Room already added', done: false });

      const new_room = new Rooms({ roomnumber, floor, capacity, available, type, cool, occupy });
      return new_room.save();
    })
    .then(saved => {
      if (saved) res.json({ message: 'Room successfully added', done: true });
    })
    .catch(() => res.json({ message: 'Error while adding a room', done: false }));
});

app.get('/allocated_room', protectAndNoCache, (req, res) => {
  Rooms.find({ $expr: { $ne: ["$capacity", "$available"] } })
    .then(rooms => res.json(rooms))
    .catch(() => res.json({ message: 'Error fetching allocated rooms' }));
});

app.get('/non_allocated_room', protectAndNoCache, (req, res) => {
  Rooms.find({ occupy: 'Empty' }).sort({ floor: 1 })
    .then(rooms => res.json(rooms))
    .catch(() => res.json({ message: 'Error fetching non-allocated rooms' }));
});

// ------------------- Room Allocation -------------------
app.post('/room_allocation', protectAndNoCache, (req, res) => {
  const { roomnumber, floor, stid, allocated_date } = req.body;

  let foundRoom; // to store the Mongoose room document for later .save()

  students.findOne({ stid })
    .then(student => {
      if (!student) {
        res.json({ message: 'Student not registered', done: false });
        throw new Error('StopPromiseChain');
      }
      return Rooms.findOne({ roomnumber, floor });
    })
    .then(room => {
      if (!room) {
        res.json({ message: 'Room not available', done: false });
        throw new Error('StopPromiseChain');
      }
      foundRoom = room; // Save the Mongoose document for later save()
      return stud_rooms.find({ roomnumber, floor });
    })
    .then(allocations => {
      if (allocations.length >= foundRoom.capacity) {
        res.json({ message: 'Room is fully allocated.', done: false });
        throw new Error('StopPromiseChain');
      }

      if (allocations.find(a => a.stid === stid)) {
        res.json({ message: `Room already allocated for student ${stid}`, done: false });
        throw new Error('StopPromiseChain');
      }

      const new_allocation = new stud_rooms({ roomnumber, floor, stid, allocated_date });
      return new_allocation.save().then(() => {
        const remaining = foundRoom.capacity - (allocations.length + 1);
        foundRoom.available = remaining;
        foundRoom.occupy = remaining === 0 ? 'Non-Empty' : 'Empty';
        return foundRoom.save();
      });
    })
    .then(() => {
      res.json({ message: `Room ${roomnumber} allocated to student ${stid}`, done: true });
    })
    .catch(err => {
      if (err.message !== 'StopPromiseChain') {
        console.error('Room allocation error:', err);
        res.json({ message: 'Error while allocating room', done: false });
      }
    });
});

app.post('/room_deallocation', protectAndNoCache, (req, res) => {
  const { roomnumber, floor, studentid } = req.body;

  stud_rooms.findOne({ stid: studentid, roomnumber, floor })
    .then(alloc => {
      if (!alloc) return res.json({ message: 'No room allocation found', done: false });

      return stud_rooms.deleteOne({ stid: studentid, roomnumber, floor });
    })
    .then(() => Rooms.findOne({ roomnumber, floor }))
    .then(room => {
      room.available += 1;
      room.occupy = room.available === 0 ? 'Non-Empty' : 'Empty';
      return room.save();
    })
    .then(() => res.json({ message: `Room ${roomnumber} deallocated for student ${studentid}`, done: true }))
    .catch(() => res.json({ message: 'Error during room deallocation.', done: false }));
});

// ---------------------- Detail Fetching ----------------------
app.post('/student_details', protectAndNoCache, (req, res) => {
  const { stid } = req.body;

  students.findOne({ stid:stid })
    .then(student => {
      if (!student) {
        res.json({ message: 'Student not registered', done: false });
        // Prevent further .then() calls
        throw new Error('HandledError');
      }
      return Promise.all([student, stud_rooms.findOne({ stid })]);
    })
    .then(([student, room]) => {
      res.json({ studentDetails: student, roomDetails: room, done: true });
    })
    .catch((error) => {
      if (error.message !== 'HandledError') {
        res.json({ message: 'Error fetching student details', done: false });
      }
      // Otherwise, response already sent — do nothing
    });
});


app.post('/room_details', protectAndNoCache, (req, res) => {
  const { roomnumber, floor } = req.body;

  Rooms.findOne({ roomnumber, floor })
    .then(room => {
      if (!room) {
        res.json({ message: 'Rooms are not available for this Room Number and Floor Number', done: false });
        // Prevent further then chaining
        throw new Error('HandledError');
      }

      return Promise.all([room, stud_rooms.find({ roomnumber, floor })]);
    })
    .then(([room, allocations]) => {
      res.json({ room_details: room, allocation_details: allocations });
    })
    .catch((error) => {
      if (error.message !== 'HandledError') {
        res.json({ message: 'Error fetching room details', done: false });
      }
      // If it's a handled error, response already sent — do nothing
    });
});


// ---------------------- Fee Generation Cron ----------------------
cron.schedule('0 0 1 * *', () => {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  stud_rooms.find()
    .then(allocations => {
      allocations.forEach(alloc => {
        Rooms.findOne({ roomnumber: alloc.roomnumber }).then(room => {
          if (!room) return;

          const allocDate = new Date(alloc.allocated_date);
          if (
            allocDate.getFullYear() < currentYear ||
            (allocDate.getFullYear() === currentYear && allocDate.getMonth() <= currentMonth)
          ) {
            Fee.findOne({ stid: alloc.stid, month: currentMonth, year: currentYear })
              .then(existing => {
                if (existing) return;

                const amount = room.type === 'AC' ? 5000 : 3000;
                const newFee = new Fee({
                  stid: alloc.stid,
                  roomnumber: alloc.roomnumber,
                  month: currentMonth,
                  year: currentYear,
                  amount,
                  status: 'due'
                });
                newFee.save().then(() => {
                  console.log(`Fee generated for ${alloc.stid} - ₹${amount}`);
                });
              });
          }
        });
      });
    });
});
app.get('/generated-fee',protectAndNoCache,(req,res)=>{
  Fee.find()
    .then(fees => res.json({ success: true, fees }))
    .catch(err => res.status(500).json({ success: false, message: 'Error fetching fees' }));
});

app.post('/fee-details', protectAndNoCache, (req, res) => {
  const { stid } = req.body;

  if (!stid) {
    return res.json({ message: 'Student ID is missing.' });
  }

  stud_rooms.findOne({ stid: stid })
    .then((room) => {
      if (!room) {
        return res.json({ message: 'Room was not allocated for the student.' });
      }

      Fee.find({ stid: stid })
        .then((fees) => {
          if (!fees || fees.length === 0) {
            return res.json({ message: 'Fee was not generated for this student.' });
          }

          // Send back the fees array as JSON
          return res.json({ fees: fees });
        })
        .catch((feeErr) => {
          console.error('Fee lookup error:', feeErr);
          res.status(500).json({ message: 'Internal server error while fetching fees.' });
        });
    })
    .catch((roomErr) => {
      console.error('Room lookup error:', roomErr);
      res.status(500).json({ message: 'Internal server error while fetching room.' });
    });
});

app.put('/pay-fee', (req, res) => {
  const { stid, roomnumber, month, year, amount } = req.body;

  Fee.findOne({ stid, roomnumber, month, year })
    .then(check_record => {
      if (!check_record) {
        return res.json({ message: 'Details are not matched, please check and try again.' });
      }

      if (check_record.status === 'paid') {
        return res.json({ message: 'Fee was already paid for the above details.' });
      }

      if (check_record.amount !== amount) {
        return res.json({ message: 'Amount does not match. Please check and try again.' });
      }

      // All validations passed, update status
      check_record.status = 'paid';
      return check_record.save().then(updated_record => {
        if (!updated_record) {
          return res.json({ message: 'Fee was not updated. Please try again.' });
        }
        return res.json({ message: 'Fee was successfully paid for the above details.' });
      });
    })
    .catch(error => {
      console.error('Error in Fee Payment process:', error);
      return res.status(500).json({ message: 'Server error during fee payment.' });
    });
});


app.use('/css', express.static(path.join(__dirname, '../public/CSS')));
app.use('/js', express.static(path.join(__dirname, '../public/JAVASCRIPT')));
app.use('/', express.static(path.join(__dirname, '../public/HTML')));

// For serving index.html from /public
app.use('/', express.static(path.join(__dirname, '../public')));

// .............................student Role Routes.................................


app.post('/student-login',(req,res)=>{
  const {stid , dob} = req.body;
  students.findOne({ stid : stid})
  .then((existed_student) => {
    if (!existed_student)
    {
      res.json({message:'Student was not Exist...'});
      return ;
    }
    if(existed_student.dob !== dob)
    {
      res.json({message:'Wrong Password.Please Try Again'});
      return ;
    }
    req.session.student = {stid : existed_student.stid};
    res.json({message:'Login Successful' , done:true})
  })
  .catch((error)=>{
    console.error('Login Error:',error);
    res.json({message:'Login Failed.Please Try Again'})
  });
})

app.post('/student-logout', (req, res) => {
  if (req.session.student) {
    req.session.destroy(err => {
      if (err) {
        console.error('Logout error:', err);
        return res.json({ message: 'Logout error', done: false });
      }
      res.clearCookie('connect.sid');
      res.json({ done: true, message: 'Logout successful' });
    });
  } else {
    res.json({ done: false, message: 'No active session' });
    return res.redirect('/');
  }
});

app.get('/stud_student_details',protectAndNoCache,(req,res)=>{
  if(!req.session.student)
  {
    res.json({message:'UnAuthorized Access.Please Login with StudentID and DOB'});
    return;
  }
  const {stid} = req.session.student;
  students.findOne({stid:stid})
  .then((check_student)=>{
    if(!check_student)
    {
      res.json({message:'Student was not Found...'});
      return ;
    }
    res.json(check_student);
  })
  .catch((error)=>{
    res.json({message:'Error While Getting Student Details...'});
    console.log(error);
  })
})

app.get('/stud_room_details',protectAndNoCache,(req,res)=>{
  if(!req.session.student)
  {
    res.json({message:'UnAuthorized Access.Please Login with StudentID and DOB'});
    return;
  }
  const {stid} = req.session.student;
  stud_rooms.findOne({stid:stid})
  .then((check_room)=>{
    if(!check_room)
    {
      res.json({message:'Room was not Found...'});
      return ;
    }
    return Promise.all([Promise.resolve(check_room),
      Rooms.findOne({roomnumber:check_room.roomnumber})
    ]);
  })
  .then(([check_room,room_data])=>{
    res.json({room_allocation_details : check_room , room_details : room_data})
  })
  .catch((error)=>{
    res.json({message:'Error While Getting Room Details...'});
    console.log(error);
  })
})

app.get('/stud-fee-details', protectAndNoCache, (req, res) => {
  const studentSession = req.session.student;
  if (!studentSession || !studentSession.stid) {
    return res.json({ success: false, message: 'Student not logged in' });
  }

  Fee.find({ stid: studentSession.stid })
    .then(fees => res.json({ success: true, fees }))
    .catch(err => {
      console.error('Error fetching fees:', err);
      res.status(500).json({ success: false, message: 'Error fetching fee details' });
    });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
