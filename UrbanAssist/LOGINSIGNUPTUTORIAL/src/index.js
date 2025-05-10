require("dotenv").config();

const express = require("express")
const path = require("path")
const app = express()
const hbs = require("hbs")
const nodemailer = require('nodemailer');
const { Collectionhomecook ,LogInCollection,HomeChef,Gardening,Gardenersinfo,Subscriberinfo,Subscribersevicerproviderinfo,PestCustomer,PestController} = require("./mongodb");

//const paymentRoute = require('./routes/paymentRoute');
//app.use('/', paymentRoute);
const port = process.env.PORT || 3000


app.use(express.json())

app.use(express.urlencoded({ extended: false }))

const viewsPath = path.join(__dirname, 'views')
const publicPath = path.join(__dirname, 'public')
const imagesPath = path.join(__dirname, 'images')

console.log(publicPath);


app.set('view engine', 'ejs')
app.set('views', viewsPath)
app.use(express.static(publicPath))
app.use('/images', express.static('images'));

app.engine('hbs', hbs.__express);
app.set('view engine', 'hbs');




// hbs.registerPartials(partialPath)


app.get('/signup', (req, res) => {
    res.render('signup')
})
app.get('/', (req, res) => {
    res.render('login')
})
app.get('/index', (req, res) => {
    res.render('index')
})
app.get('/homecook', (req, res) => {
    res.render('homecook')
})
app.get('/login', (req, res) => {
    res.render('login')
})
app.get('/booking_success', (req, res) => {
    res.render('booking_success')
})
app.get('/check_out', (req, res) => {
    res.render('check_out')
})
app.get('/gardening', (req, res) => {
    res.render('gardening')
})
app.get('/booking_success_gardener', (req, res) => {
    res.render('booking_success_gardener')
})

app.get('/subscription', (req, res) => {
    res.render('subscription')
})

app.get('/booking_success_subscriber', (req, res) => {
    res.render('booking_success_subscriber')
})

app.get('/pestcontrol', (req, res) => {
    res.render('pestcontrol')
})

app.get('/booking_success_pest', (req, res) => {
    res.render('booking_success_pest')
})
//app.get('/product', (req, res) => {
 //   res.render('product.ejs')
//})

 //app.get('/home', (req, res) => {
   //  res.render('home')
 //})

 app.post('/signup', async (req, res) => {
    const data = {
        name: req.body.name,
        password: req.body.password
    };
    

    const checking = await LogInCollection.findOne({ name: req.body.name });

    try {
        if (checking && checking.name === req.body.name && checking.password === req.body.password) {
            res.send("user details already exist");
        } else {
            await LogInCollection.insertMany([data]);

            res.redirect('/login');
        }
    } catch (error) {
        console.error("Error during signup:", error);
        res.status(500).send("An error occurred during signup");
    }
});


app.post('/login', async (req, res) => {

    try {
        const check = await LogInCollection.findOne({ name: req.body.name })

        if (check.password === req.body.password) {
           // res.status(201).render("home", { naming: `${req.body.password}+${req.body.name}` })
            res.redirect('/index')
        }

        else {
            res.send("incorrect password")
        }


    }

    
    catch (e) {
        
        res.send("wrong details")
        

    }


})

const transporter = nodemailer.createTransport({
    host: 'smtp.elasticemail.com',
    port: 587,
    secure: false, // false for TLS; true for SSL
    auth: {
        user: 'nigamvedant100@gmail.com', // Your email address
        pass: 'EE7F0CD8E2B86963A45C7A6F70C1248AD4B6' // Your password or API key
    }
});

app.post('/book', async (req, res) => {
    try {
        // Your existing code for saving the booking

        // Send email confirmation
        const availableChefs = await HomeChef.find({
            address: req.body.address,
            availability: req.body.timeslot
        });

        if (availableChefs.length === 0) {
            return res.send('No available home chefs for the selected time slot and address');
        }

        // Randomly select a home chef
        const assignedChef = availableChefs[Math.floor(Math.random() * availableChefs.length)];
        transporter.sendMail({
            from: 'nigamvedant100@gmail.com', // Sender address
            to: req.body.email, // Recipient address
            subject: 'Greeting from URBAN ASSIST Booking Confirmation', // Subject line
            text: `Your booking has been confirmed. Thank you for choosing us!\n\nHome Chef Details:\nName: ${assignedChef.name}\nAddress: ${assignedChef.address}\nPhone: ${assignedChef.phone}\nEmail: ${assignedChef.email}\nSpecialization: ${assignedChef.specialization}`
 // Plain text body
        }, (error, info) => {
            if (error) {
                console.error('Error sending email:', error);
            } else {
                console.log('Email sent:', info.response);
            }
        });

        transporter.sendMail({
            from: 'nigamvedant100@gmail.com', // Sender address
            to: assignedChef.email, // Recipient address (home cook)
            subject: 'Greeting from URBAN_ASSIST New Booking Notification', // Subject line
            text: `You have a new booking! \n\nCustomer details: \nName - ${req.body.name}\nAddress - ${req.body.address}\nPhone - ${req.body.phone}\n Email - ${req.body.email}\n Time Slot - ${req.body.timeslot}` // Plain text body
        }, (error, info) => {
            if (error) {
                console.error('Error sending email to home cook:', error);
            } else {
                console.log('Email sent to home cook:', info.response);
            }
        });

        const newBooking = new Collectionhomecook({
            name: req.body.name,
            address: req.body.address,
            pincode: req.body.pincode,
            completeaddress: req.body.completeaddress,
            phone: req.body.phone,
            email: req.body.email,
            timeslot: req.body.timeslot
        });

        // Save the new document to the database
        await newBooking.save();
        // Respond with a success message or redirect
        res.redirect(`/booking_success?chefName=${assignedChef.name}`);
    } catch (error) {
        // If an error occurs, respond with an error message
        console.error('Error during booking:', error);
        res.status(500).send('An error occurred during booking: ' + error.message);
    }
});


app.post('/bookGardener', async (req, res) => {
    try {
        // Your existing code for saving the booking

        // Send email confirmation
        const availablegardener = await Gardenersinfo.find({
            address: req.body.address,
            availability: req.body.timeslot
        });

        if (availablegardener.length === 0) {
            return res.send('No available Gardener for the selected time slot and address');
        }

        // Randomly select a home chef
        const assignedgardener = availablegardener[Math.floor(Math.random() * availablegardener.length)];
        transporter.sendMail({
            from: 'nigamvedant100@gmail.com', // Sender address
            to: req.body.email, // Recipient address
            subject: 'Greeting from URBAN ASSIST Booking Confirmation', // Subject line
            text: `Your booking has been confirmed. Thank you for choosing us!\n\nGardener's Details:\nName: ${assignedgardener.name}\nAddress: ${assignedgardener.address}\nPhone: ${assignedgardener.phone}\nEmail: ${assignedgardener.email}`
 // Plain text body
        }, (error, info) => {
            if (error) {
                console.error('Error sending email:', error);
            } else {
                console.log('Email sent:', info.response);
            }
        });

        transporter.sendMail({
            from: 'nigamvedant100@gmail.com', // Sender address
            to: assignedgardener.email, // Recipient address (home cook)
            subject: 'Greeting from URBAN_ASSIST New Booking Notification', // Subject line
            text: `You have a new booking! \n\nCustomer details: \nName - ${req.body.name}\nAddress - ${req.body.address}\nPhone - ${req.body.phone}\n Email - ${req.body.email}\n Message - ${req.body.essage}\n Time Slot - ${req.body.timeslot}` // Plain text body
        }, (error, info) => {
            if (error) {
                console.error('Error sending email to Gardener:', error);
            } else {
                console.log('Email sent to Gardener:', info.response);
            }
        });

        const newBooking = new Gardening({
            name: req.body.name,
            address: req.body.address,
            pincode: req.body.pincode,
            completeaddress: req.body.completeaddress,
            phone: req.body.phone,
            email: req.body.email,
            message: req.body.message,
            timeslot: req.body.timeslot
        });

        // Save the new document to the database
        await newBooking.save();
        // Respond with a success message or redirect
        res.redirect(`/booking_success_gardener?gardenername=${assignedgardener.name}`);
    } catch (error) {
        // If an error occurs, respond with an error message
        console.error('Error during booking:', error);
        res.status(500).send('An error occurred during booking: ' + error.message);
    }
});


app.post('/subscription1', async (req, res) => {
    try {
        // Your existing code for saving the booking

        // Send email confirmation
        const availableperson = await Subscribersevicerproviderinfo.find({
            address: req.body.address,
            service: req.body.service,
            duration: req.body.duration,
            frequency: req.body.frequency,
        });

        if (availableperson.length === 0) {
            return res.send('No available service provider for the selected time slot and address');
        }

        // Randomly select a home chef
        const assignedperson = availableperson[Math.floor(Math.random() * availableperson.length)];
        transporter.sendMail({
            from: 'nigamvedant100@gmail.com', // Sender address
            to: req.body.email, // Recipient address
            subject: 'Greeting from URBAN ASSIST Booking Confirmation', // Subject line
            text: `Your booking has been confirmed. Thank you for choosing us!\n\nService Provider details Details:\nName: ${assignedperson.name}\nAddress: ${assignedperson.address}\nPhone: ${assignedperson.phone}\nEmail: ${assignedperson.email}`
 // Plain text body
        }, (error, info) => {
            if (error) {
                console.error('Error sending email:', error);
            } else {
                console.log('Email sent:', info.response);
            }
        });

        transporter.sendMail({
            from: 'nigamvedant100@gmail.com', // Sender address
            to: assignedperson.email, // Recipient address (home cook)
            subject: 'Greeting from URBAN_ASSIST New Booking Notification', // Subject line
            text: `You have a new booking! \n\nCustomer details: \nName - ${req.body.name}\nAddress - ${req.body.address}\nPhone - ${req.body.phone}\n Email - ${req.body.email}\n Service- ${req.body.service}\n Duration - ${req.body.duration}\n Frequency- ${req.body.frequency}` // Plain text body
        }, (error, info) => {
            if (error) {
                console.error('Error sending email to Service provider:', error);
            } else {
                console.log('Email sent to Service provider:', info.response);
            }
        });

        const newBooking = new Subscriberinfo({
            name: req.body.name,
            address: req.body.address,
            pincode: req.body.pincode,
            completeaddress: req.body.completeaddress,
            phone: req.body.phone,
            email: req.body.email,
            service: req.body.service,
            duration: req.body.duration,
            frequency:  req.body.frequency

        });

        // Save the new document to the database
        await newBooking.save();
        // Respond with a success message or redirect
        res.redirect(`/booking_success_subscriber?subscriberhelper=${assignedperson.name}`);
    } catch (error) {
        // If an error occurs, respond with an error message
        console.error('Error during booking:', error);
        res.status(500).send('An error occurred during booking: ' + error.message);
    }
});



app.post('/bookPestControl', async (req, res) => {
    try {
        // Your existing code for saving the booking

        // Send email confirmation
        const availablepest = await PestController.find({
            address: req.body.address,
            availability: req.body.timeslot
        });

        if (availablepest.length === 0) {
            return res.send('No available pest controller for the selected time slot and address');
        }

        // Randomly select a home chef
        const assignedpest = availablepest[Math.floor(Math.random() * availablepest.length)];
        transporter.sendMail({
            from: 'nigamvedant100@gmail.com', // Sender address
            to: req.body.email, // Recipient address
            subject: 'Greeting from URBAN ASSIST Booking Confirmation', // Subject line
            text: `Your booking has been confirmed. Thank you for choosing us!\n\nPest Controller Details:\nName: ${assignedpest.name}\nAddress: ${assignedpest.address}\nPhone: ${assignedpest.phone}\nEmail: ${assignedpest.email}`
 // Plain text body
        }, (error, info) => {
            if (error) {
                console.error('Error sending email:', error);
            } else {
                console.log('Email sent:', info.response);
            }
        });

        transporter.sendMail({
            from: 'nigamvedant100@gmail.com', // Sender address
            to: assignedpest.email, // Recipient address (home cook)
            subject: 'Greeting from URBAN_ASSIST New Booking Notification', // Subject line
            text: `You have a new booking! \n\nCustomer details: \nName - ${req.body.name}\nAddress - ${req.body.address}\nPhone - ${req.body.phone}\n Email - ${req.body.email}\n Time Slot - ${req.body.timeslot}` // Plain text body
        }, (error, info) => {
            if (error) {
                console.error('Error sending email to Pest Controller:', error);
            } else {
                console.log('Email sent to  Pest Controller:', info.response);
            }
        });

        const newBooking = new PestCustomer({
            name: req.body.name,
            address: req.body.address,
            pincode: req.body.pincode,
            completeaddress: req.body.completeaddress,
            phone: req.body.phone,
            email: req.body.email,
            message: req.body.message,
            timeslot: req.body.timeslot
        });

        // Save the new document to the database
        await newBooking.save();
        // Respond with a success message or redirect
        res.redirect(`/booking_success_pest?pestname=${assignedpest.name}`);
    } catch (error) {
        // If an error occurs, respond with an error message
        console.error('Error during booking:', error);
        res.status(500).send('An error occurred during booking: ' + error.message);
    }
});




  //app.use('/api', paymentRoute);
app.listen(port, () => {
    console.log('port connected');
})