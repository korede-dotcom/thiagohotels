const express = require("express")
const app = express()
const routes = require("./routes/Index")
// const authRoute = require("./routes/Auth")
// const terminalRoute = require("./routes/Terminal")
// const walletRoute = require("./routes/Wallet")
// const rentalRoute = require("./routes/Rental")
// const commissionRoute = require("./routes/commmssion")
// const transactionRoute = require("./routes/Transaction")
// const managerRoute = require("./routes/Manager")
// const {addAllRoles} = require("./services/AddRoles")
// const AddRoles = require("./roles.json")
const connectDB = require("./config/connectDB")
const  cors = require('cors')
const path = require("path")
const {errorHandler} = require("./middleware/Error")
const hotelConfigRepository = require("./repos/Room-repo")
const HotelBooking = require("./models/HotelBooking")


const cookieParser = require('cookie-parser');
const PaymentMode = require("./models/PaymentMode")
require("dotenv").config()

app.use(cors());

(async () => {
  await connectDB.authenticate().then(async () => {
      console.log('DB Connected...'); 

  const paymentModes = [
      // {
      //   mode: "Credit Card",
      //   status: true
      // },
      {
        mode: "customer-self-payment",
        status: true
      },
      {
        mode: "Bank Transfer",
        status: true
      },
      {
        mode: "Cash",
        status: true
      }
];

// Bulk create payment modes

    const findAllPaymentModes = await PaymentMode.findAll();
    if (findAllPaymentModes.length === paymentModes.length) {
      console.log('Payment modes already seeded.');
      return;
    }
    const seedPaymentMode = await PaymentMode.bulkCreate(paymentModes);
    console.log('Payment modes seeded successfully:', seedPaymentMode);

  // Run the seeding function
  


  }).catch(err => {
      console.log(err);
  })
})();



app.set('view engine', 'ejs');



// Middleware to serve static files (like CSS, JS, images)
app.use(express.static(path.join(__dirname, 'views')));
app.use((req, res, next) => {
  if (req.path.startsWith('/portal')) {
    app.use(express.static(path.join(__dirname, 'views/portal')));
      app.set('views', path.join(__dirname, 'views', 'portal'));
  } else {
      app.set('views', path.join(__dirname, 'views'));
  }
  next();
});


app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());


// app.use('/uploads', express.static(path.join(__dirname,"uploads")));



// app.get("/", async function (req, res) {
//   const pkgs = await hotelConfigRepository.findDistint()
//   console.log("🚀 ~ pkgs:", pkgs)
//   // await HotelBooking.create(
//   //   {title:"Deluxe Suite",start:"2023-08-17T15:00:00+01:00",end:"2023-08-20",guest_name:"John Doe",guest_email:"john.doe@example.com",guest_phone:"+2341234567890",room_id:1,branch_id:2,guest_address:"123 Main Street, Lagos",guest_count:2,payment_mode:"card",reference_id:"REF123456789"}
//   // )
//   res.render('index', {
//     pkgs: pkgs,
//   });
// });





app.use(express.Router())

app.use(routes)

app.use(errorHandler)

const port = process.env.Port || 9800

app.listen(port,()=> console.log(`server running on ${port}`))


