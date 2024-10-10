import User from "../models/UserSchema.js";
import bcrypt from "bcrypt";

export const registerControllers = async (req, res, next) => {
    try{
        const {name, email, password} = req.body;

        // console.log(name, email, password);

        if(!name || !email || !password){
            return res.status(400).json({
                success: false,
                message: "Please enter All Fields",
            }) 
        }

        let user = await User.findOne({email});

        if(user){
            return res.status(409).json({
                success: false,
                message: "User already Exists",
            });
        }

        const salt = await bcrypt.genSalt(10);

        const hashedPassword = await bcrypt.hash(password, salt);

        // console.log(hashedPassword);

        let newUser = await User.create({
            name, 
            email, 
            password: hashedPassword, 
        });

        return res.status(200).json({
            success: true,
            message: "User Created Successfully",
            user: newUser
        });
    }
    catch(err){
        return res.status(500).json({
            success: false,
            message: err.message,
        });
    }

}
export const loginControllers = async (req, res, next) => {
    try{
        const { email, password } = req.body;

        // console.log(email, password);
  
        if (!email || !password){
            return res.status(400).json({
                success: false,
                message: "Please enter All Fields",
            }); 
        }
    
        const user = await User.findOne({ email });
    
        if (!user){
            return res.status(401).json({
                success: false,
                message: "User not found",
            }); 
        }
    
        const isMatch = await bcrypt.compare(password, user.password);
    
        if (!isMatch){
            return res.status(401).json({
                success: false,
                message: "Incorrect Email or Password",
            }); 
        }

        delete user.password;

        return res.status(200).json({
            success: true,
            message: `Welcome back, ${user.name}`,
            user,
        });

    }
    catch(err){
        return res.status(500).json({
            success: false,
            message: err.message,
        });
    }
}

export const setAvatarController = async (req, res, next)=> {
    try{

        const userId = req.params.id;
       
        const imageData = req.body.image;
      
        const userData = await User.findByIdAndUpdate(userId, {
            isAvatarImageSet: true,
            avatarImage: imageData,
        },
        { new: true });

        return res.status(200).json({
            isSet: userData.isAvatarImageSet,
            image: userData.avatarImage,
          });


    }catch(err){
        next(err);
    }
}

export const allUsers = async (req, res, next) => {
    try{
        const user = await User.find({_id: {$ne: req.params.id}}).select([
            "email",
            "username",
            "avatarImage",
            "_id",
        ]);

        return res.json(user);
    }
    catch(err){
        next(err);
    }
}

export const addNewBankAccount = async(req,res)=>{
    try{
        const {email, bankName, accountBalance} = req.body;
        if(!email || !bankName || !accountBalance){
            return res.status(400).json({
                success: false,
                message: "Please enter All Fields",
            }); 
        }

        const user = await User.findOne({ email });
    
        if (!user){
            return res.status(401).json({
                success: false,
                message: "User not found",
            }); 
        }

        user.bankAccount.push({bankName ,accountBalance})
        user.save();

        return res.status(200).json({success:true,message:"Bank account added successfully"})
    }catch(err){
        return res.status(500).json({success:false,message:"Internal server error"})
    }
}


export const deleteBankAccount = async(req,res)=>{
    try{
        const {email, bankName, accountBalance, index} = req.body;
        console.log(email, bankName, accountBalance, index)
        if(!email || !bankName || !accountBalance || index===undefined){
            return res.status(400).json({
                success: false,
                message: "Please enter All Fields",
            }); 
        }

        const user = await User.findOne({ email });
    
        if (!user){
            return res.status(401).json({
                success: false,
                message: "User not found",
            }); 
        }

        user.bankAccount.splice(index,1)
        user.save();

        return res.status(200).json({success:true,message:"Bank account deleted successfully"})
    }catch(err){
        return res.status(500).json({success:false,message:"Internal server error"})
    }
}

export const getBankDetails = async(req,res)=>{
    try{
        const {email} = req.body;
        if(!email){
            return res.status(400).json({
                success: false,
                message: "Please login",
            }); 
        }

        const user = await User.findOne({ email });
    
        if (!user){
            return res.status(401).json({
                success: false,
                message: "User not found",
            }); 
        }

        return res.status(200).json({success : true, message:"Bank details fetched", bankDetaile : user.bankAccount})

    }catch(err){
        return res.status(500).json({success:false,message:"Internal server error"})
    }
}




