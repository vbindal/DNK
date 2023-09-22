import { useEffect, useState } from 'react';
import TextField from '@mui/material/TextField'
import { useSnackbar } from 'notistack';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { clearErrors, registerUser } from '../../actions/userAction';
import BackdropLoader from '../Layouts/BackdropLoader';
import MetaData from '../Layouts/MetaData';


const Register = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();


    const { loading, isAuthenticated, error } = useSelector((state) => state.user);

    const [user, setUser] = useState({
        firstName:"",
        lastName:"",
        phoneNumber:"",
        HomeAddress:"",
        pincode:"",
        district:"",
        state:"",
        email: "",
        country:"",
        password: "",
        confirmPassword: "",

    });
const {firstName,
lastName,
phoneNumber,
HomeAddress,
pincode,
district,
state,
email,
country,
password,
confirmPassword}=user;
    

   

    // const handleRegister = (e) => {
    //     e.preventDefault();
    //     if (password.length < 8) {
    //         enqueueSnackbar("Password length must be atleast 8 characters", { variant: "warning" });
    //         return;
    //     }
    //     if (password !== confirmPassword) {
    //         enqueueSnackbar("Password Doesn't Match", { variant: "error" });
    //         return;
    //     }

    //     const formData = new FormData();
    //     formData.set("email", email);
    //     formData.set("firstName",firstName)
    //     formData.set("lastName",lastName)
    //     formData.set("phoneNumber",phoneNumber)
    //     formData.set("HomeAddress",HomeAddress)
    //     formData.set("pincode",pincode)
    //     formData.set("district",district)
    //     formData.set("state",state)
    //     formData.set("country",country)
    //     formData.set("password", password);

    //     dispatch(registerUser(formData));
    // }

    const handleDataChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    }

    const OnSubmitHandler=(e)=>{
        e.preventDefault(); 
        console.log("yes");
        const jsonData = {
            "firstName":"vb",
            "lastName":"ncwjd",
            "phoneNumber":"jbhsc",
           "HomeAddress":"mndbc",
            "pincode":"mnchd",
            "username": "hdsbd",
            "district":"jcbd",
            "state":"ncjdh",
            "email": "necshcdhb",
            "country":"jbdchy",
            "password": "12345",
            "confirmPassword": "12345"
    };
        fetch("https:/locolhost:4000/dnk/User/signIn", {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json', // Specify the content type as JSON
            },
            body: JSON.stringify(jsonData)  , // Convert the JSON object to a string
          })
            .then((response) => {
              if (!response.ok) {
                throw new Error('Network response was not ok');
              }
              return response.json(); // Parse the response body as JSON
            })
            .then((data) => {
              // Handle the JSON response data here
              console.log(data);
            })
            .catch((error) => {
              // Handle any errors that occurred during the fetch
              console.error('Fetch error:', error);
            });
        }
    

    useEffect(() => {
        if (error) {
            enqueueSnackbar(error, { variant: "error" });
            dispatch(clearErrors());
        }
        if (isAuthenticated) {
            navigate('/')
        }
    }, [dispatch, error, isAuthenticated, navigate, enqueueSnackbar]);

    return (
        <>
            <MetaData title="Register | Flipkart" />

            {loading && <BackdropLoader />}
            <main className="w-full mt-12 sm:pt-20 sm:mt-0">

                {/* <!-- row --> */}
                <div className="flex sm:w-4/6 sm:mt-4 m-auto mb-7 bg-white shadow-lg">

                    {/* <FormSidebar
                        title="Looks like you're new here!"
                        tag="Sign up with your mobile number to get started"
                    /> */}

                    {/* <!-- signup column --> */}
                    <div className="flex-1 overflow-hidden">

                        {/* <!-- personal info procedure container --> */}
                        <form
                            onSubmit={OnSubmitHandler}
                            encType="multipart/form-data"
                            className="p-5 sm:p-10"
                        >
                            <div className="flex flex-col gap-4 items-start">

                                {/* <!-- input container column --> */}
                                <div className="flex flex-col w-full justify-between sm:flex-col gap-3 items-center">
                                    <TextField
                                        fullWidth
                                        id="firstname"
                                        label="FirstName"
                                        name="firstName"
                                        value={firstName}   /* firstName -> name */
                                        onChange={handleDataChange}
                                        required
                                    />
                                    <TextField
                                        fullWidth
                                        id="lastName"
                                        label="LastName"
                                        name="lastName"
                                        value={lastName}   /* firstName -> name */
                                        onChange={handleDataChange}
                                        required
                                    />
                                    <TextField
                                        fullWidth
                                        id="email"
                                        label="Email"
                                        type="email"
                                        name="email"
                                        value={email}
                                         onChange={handleDataChange}
                                        required
                                    />
                                    <TextField
                                        fullWidth
                                        id="phoneNumber"
                                        label="phoneNumber"
                                        name="phoneNumber"
                                        value={phoneNumber}
                                         onChange={handleDataChange}
                                        required
                                    />
                                         <TextField
                                        fullWidth
                                        id="HomeAddress"
                                        label="HomeAddress"
                                        name="HomeAddress"
                                        value={HomeAddress}   /* firstName -> name */
                                         onChange={handleDataChange}
                                        required
                                    />
                                         <TextField
                                        fullWidth
                                        id="pincode"
                                        label="pincode"                   
                                        name="pincode"
                                        value={pincode}   /* firstName -> name */
                                         onChange={handleDataChange}
                                        required
                                    />
                                         <TextField
                                        fullWidth
                                        id="district"
                                        label="district"
                                        name="district"
                                        value={district}   /* firstName -> name */
                                         onChange={handleDataChange}
                                        required
                                    />
                                         <TextField
                                        fullWidth
                                        id="state"
                                        label="state"
                                        name="state"
                                        value={state}   /* firstName -> name */
                                         onChange={handleDataChange}
                                        required
                                    />
                                         <TextField
                                        fullWidth
                                        id="country"
                                        label="country"
                                        name="country"
                                        value={country}   /* firstName -> name */
                                        onChange={handleDataChange}
                                        required
                                    />
                                </div>
                                {/* <!-- input container column --> */}

                                {/* <!-- gender input --> */}
                                {/* <div className="flex gap-4 items-center">
                                    <h2 className="text-md">Your Gender :</h2>
                                    <div className="flex items-center gap-6" id="radioInput">
                                        <RadioGroup
                                            row
                                            aria-labelledby="radio-buttons-group-label"
                                            name="radio-buttons-group"
                                        >
                                            <FormControlLabel name="gender" value="male" onChange={handleDataChange} control={<Radio required />} label="Male" />
                                            <FormControlLabel name="gender" value="female" onChange={handleDataChange} control={<Radio required />} label="Female" />
                                        </RadioGroup>
                                    </div>
                                </div> */}
                                {/* <!-- gender input --> */}

                                {/* <!-- input container column --> */}
                                <div className="flex flex-col w-full justify-between sm:flex-row gap-3 items-center">
                                    <TextField
                                        id="password"
                                        label="Password"
                                        type="password"
                                        name="password"
                                        value={password}
                                        onChange={handleDataChange}
                                        required
                                    />
                                    <TextField
                                        id="confirmPassword"
                                        label="confirmPassword"
                                        type="password"
                                        name="confirmPassword"
                                        value={confirmPassword}
                                        onChange={handleDataChange}
                                        required
                                    />
                                </div>
                                {/* <!-- input container column --> */}

                                {/* <div className="flex flex-col w-full justify-between sm:flex-row gap-3 items-center">
                                    <Avatar
                                        alt="Avatar Preview"
                                        src={avatarPreview}
                                        sx={{ width: 56, height: 56 }}
                                    />
                                    {/* <label className="rounded font-medium bg-gray-400 text-center cursor-pointer text-white w-full py-2 px-2.5 shadow hover:shadow-lg">
                                        <input
                                            type="file"
                                            name="avatar"
                                            accept="image/*"
                                            onChange={handleDataChange}
                                            className="hidden"
                                        />
                                        Choose File
                                    </label> 
                                </div> */}
                                <button type="submit"   className="text-white py-3 w-full bg-primary-orange shadow hover:shadow-lg rounded-sm font-medium">Signup</button>
                                <Link to="/login" className="hover:bg-gray-50 text-primary-blue text-center py-3 w-full shadow border rounded-sm font-medium">Existing User? Log in</Link>
                            </div>

                        </form>
                        {/* <!-- personal info procedure container --> */}

                    </div>
                    {/* <!-- signup column --> */}
                </div>
                {/* <!-- row --> */}

            </main>
        </>
    );
};
export default Register;

