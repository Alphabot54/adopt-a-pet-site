const express = require('express');
const path = require('path');
const fs = require('fs');
const session = require('express-session');

const app = express();
const PORT = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: 'h23ueDdhN98hdh9D834ydAS42j3psc0i',
    resave: false,
    saveUninitialized: false,
    cookie: {maxAge: 24 * 60 * 60 * 1000} // lasts one day
}));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static('public'));

//Routes to pages
app.get('/', (req, res) => {
    const isLoggedIn = req.session.isLoggedIn || false;
    const logoutMessage = req.query.logout ? 'You have been successfully logged out.' : undefined;
    const loginMessage = req.query.login ? 'You have been successfully logged in.' : undefined;
    const petAdded = req.query.petAdded ? 'Pet has been successfully added to give away.' : undefined;
    res.render('index', {title: "Home", style: "index.css", isLogged: isLoggedIn, logoutMessage: logoutMessage, loginMessage: loginMessage, petAdded: petAdded});
});
app.get('/contact', (req, res) => {
    const isLoggedIn = req.session.isLoggedIn || false;
    res.render('contact', {title: "Contact Us", style: "index.css", isLogged: isLoggedIn});
});
app.get('/catCare', (req, res) => {
    const isLoggedIn = req.session.isLoggedIn || false;
    res.render('catCare', {title: "Cat Care", style: "index.css", isLogged: isLoggedIn});
});
app.get('/dogCare', (req, res) => {
    const isLoggedIn = req.session.isLoggedIn || false;
    res.render('dogCare', {title: "Dog Care", style: "index.css", isLogged: isLoggedIn});
});
app.get('/login', (req, res) => {
    const isLoggedIn = req.session.isLoggedIn || false;
    if (isLoggedIn) return res.redirect('/');
    res.render('login', {title: "Log In", style: "form.css", isLogged: isLoggedIn});
});
app.get('/createAccount', (req, res) => {
    const isLoggedIn = req.session.isLoggedIn || false;
    if (isLoggedIn) return res.redirect('/');
    res.render('createAccount', {title: "Create Account", style: "form.css", isLogged: isLoggedIn});
});
app.get('/findPet', (req, res) => {
    const isLoggedIn = req.session.isLoggedIn || false;
    res.render('findPet', {title: "Find a Pet", style: "form.css", isLogged: isLoggedIn});
});
app.get('/givePet', (req, res) => {
    const isLoggedIn = req.session.isLoggedIn || false;
    if(!isLoggedIn) return res.redirect('/login');
    /*const message = req.query.message ? 'Cannot be both a dog and a cat.' : undefined;*/
    res.render('givePet', {title: "Give away a Pet", style: "form.css", isLogged: isLoggedIn/*, message: message*/});
});

//log out
app.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.redirect('/?logout=1');
        }
        res.clearCookie('connect.sid');
        res.redirect('/?logout=1');
    }); // remove cookie
});

//log into account
app.post('/login', (req, res) => {
    const {username, password} = req.body;
    const isLoggedIn = req.session.isLoggedIn || false;
    fs.readFile(path.join(__dirname, 'login.txt'), 'utf8', (err, data) => {
        if (err) return res.render('login', {title: "Log In", style: "form.css", isLogged: isLoggedIn, message: 'Server File Error'});
        const lines = data.trim().split('\n');
        for(let line of lines) {
            const [storedUsername, storedPassword] = line.split(':');
            if(storedUsername === username && storedPassword === password) { 
                req.session.isLoggedIn = true;
                req.session.username = username;
                return res.redirect('/?login=1');
            }
        }
        // bad log in information
        return res.render('login', {title: "Log In", style: "form.css", isLogged: isLoggedIn, message: 'Username or Password incorrect'});
    });
});

//create an account
app.post('/createAccount', (req, res) => {
    const {username, password, checkPassword} = req.body;
    const isLoggedIn = req.session.isLoggedIn || false;
    // check if usernames are same
    fs.readFile(path.join(__dirname, 'login.txt'), 'utf8', (err, data) => {
        if (err) res.render('createAccount', {title: "Create Account", style: "form.css", isLogged: isLoggedIn, message: 'Username already Taken'});
        const lines = data.trim().split('\n');
        for(let line of lines) {
            const [storedUsername, storedPassword] = line.split(':');
            if(storedUsername === username) res.render('createAccount', {title: "Create Account", style: "form.css", isLogged: isLoggedIn, message: 'Username already Taken'});
        }
        if(password === checkPassword) {
            addUser(username, password);
            res.render('login', {title: "Log In", style: "form.css", isLogged: isLoggedIn, message: `Account created successfully. Hello, ${username}!`});
        } else {
            res.render('createAccount', {title: "Create Account", style: "form.css", isLogged: isLoggedIn, message: 'Passwords don\'t match'});
        }
    });
});

//give away a pet
app.post('/givePet', (req, res) => {
    const {animalChoice, animalBreed, animalAge, genderChoice, getAlongWith, comments, animalName, ownerFirstName, ownerLastName, email} = req.body;
    fs.readFile(path.join(__dirname, 'availablePetInformation.txt'), 'utf8', (err, data) => {
        if (err) {
            console.error('Failed to save pet info:', err);
            return res.redirect('/givePet');
        }
        // get index
        const index = data.trim().split('\n').length + 1;
        // get username from cookies
        const username = req.session.username || 'guest';
        //turn getAlongWith array into string
        let compatibility = '';
        if (Array.isArray(getAlongWith)) {
            compatibility = getAlongWith.join(',');
        } else if (typeof getAlongWith === 'string') {
            compatibility = getAlongWith;
        }
        /*
        //check that user didn't pick an pet that is both a dog and a cat
        if(animalChoice === "dog" && (animalBreed === "Siamese" || animalBreed === "British Shorthair" || animalBreed === "Persian")) {
            return res.redirect('/givePet/?message=1');
        } else if(animalChoice === "cat" && (animalBreed === "German Shepherd" || animalBreed === "Bulldog" || animalBreed === "Golden Retriever")) {
            return res.redirect('/givePet/?message=1');
        }
        */
        //Add image default...
        let imageEnd = (animalAge < 3) ? "youngerPetImg/" : "olderPetImg/";
        imageEnd += (animalChoice === "dog") ? 'd' : 'c';
        switch(animalBreed) {
            case "German Shepherd":
                imageEnd += 'gs';
                break;
            case "Bulldog":
                imageEnd += 'b';
                break;
            case "Golden Retriever":
                imageEnd += 'gr';
                break;
            case "Mixed":
                imageEnd += 'm';
                break;
            case "Siamese":
                imageEnd += 's';
                break;
            case "British Shorthair":
                imageEnd += 'b';
                break;
            case "Persian":
                imageEnd += 'p';
                break;
            default:
                imageEnd = 'unknown';
                break;
        }
        if(imageEnd !== 'unknown') {
            imageEnd += (animalAge < 3) ? Math.floor(Math.random() * 2) : Math.floor(Math.random() * 3);
        } else {
            imageEnd = 'img/petNotFound';
        }
        imageEnd += '.jpg';
        //line
        const line = `${index}:${username}:${animalChoice}:${animalBreed}:${animalAge}:${genderChoice}:${compatibility}:${comments}:${animalName}:${ownerFirstName}:${ownerLastName}:${email}:${imageEnd}\n`;
        //write to file
        fs.appendFile(path.join(__dirname,'availablePetInformation.txt'), line, (err) => {
            if (err) {
                console.error('Failed to save pet info:', err);
                return res.redirect('/givePet')
            } else {
                return res.redirect('/?petAdded=1');
            }
        });
    });
});

app.post('/findPet', (req, res) => {
    const {animalChoice, animalBreed, animalAge, genderChoice, getAlongWith} = req.body;
    const isLoggedIn = req.session.isLoggedIn || false;
    let tmpBrowsePets = [];
    let browsePets = [];
    fs.readFile(path.join(__dirname, 'availablePetInformation.txt'), 'utf8', (err, data) => {
        if (err) {
            console.error('Failed to save find available pets:', err);
            return res.redirect('/findPet');
        }
        const lines = data.trim().split('\n');
        if(lines.length === 0) {
            //404 no pets...
            res.render('browse', {title: "Find a Pet", style: "browse.css", isLogged: isLoggedIn});
        }
        for(let line of lines) {
            const [id, username, animalChoice, animalBreed, animalAge, genderChoice, getAlongWith, comments, animalName, ownerFirstName, ownerLastName, email, image] = line.split(':');
            tmpBrowsePets.push({animalChoice, animalBreed, animalAge: parseInt(animalAge), genderChoice, getAlongWith, comments, animalName, ownerFirstName, ownerLastName, email, image});
        }
        for(pet of tmpBrowsePets) {
            let isValid = true;
            if(animalChoice !== 'none' && pet.animalChoice !== animalChoice)
                isValid = false;
            else if(animalBreed !== 'none' && animalBreed !== pet.animalBreed)
                isValid = false;
            else if(animalAge !== 'none') {
                if(animalAge === 'ZeroToOne' && pet.animalAge > 1)
                    isValid = false;
                else if (animalAge === 'OneToThree' && (pet.animalAge > 3 || pet.animalAge < 1))
                    isValid = false;
                else if(animalAge === 'ThreeToFive' && (pet.animalAge > 5 || pet.animalAge < 3))
                    isValid = false;
                else if(animalAge === 'FiveToTen' && (pet.animalAge > 10 || pet.animalAge < 5))
                    isValid = false;
                else if(animalAge === 'TenPlus' && pet.animalAge < 10)
                    isValid = false;
            }
            else if(genderChoice !== 'none' && genderChoice !== pet.genderChoice)
                isValid = false;
            else if(Array.isArray(getAlongWith)) {
                for(let element of getAlongWith) {
                    if(!pet.getAlongWith.includes(element)) {
                        isValid = false;
                        break;
                    }
                }
            }
            else if (typeof getAlongWith === 'string') {
                if(!pet.getAlongWith.includes(getAlongWith))
                    isValid = false;
            }
            //if pet is valid, transfer it to new array
            if(isValid) {
                pet.isLoved = false;
                browsePets.push(pet);
            }
        }
        res.render('browse', {title: "Find a Pet", style: "browse.css", isLogged: isLoggedIn, pets: browsePets});
    });
});

//Running Server through console
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

//Add new user
function addUser(username, password) {
    const user = `${username}:${password}\n`;
    fs.appendFile(path.join(__dirname, 'login.txt'), user, (err) => {
        if (err) {
            return false;
        } else {
            return true;
        }
    });
}