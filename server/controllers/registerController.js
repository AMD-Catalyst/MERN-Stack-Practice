const User = require("../model/User");
const bcrypt = require("bcrypt");

const handleNewUser = async (req, res) => {
  const { user, pwd } = req.body;
  if (!user || !pwd)
    return res
      .status(400)
      .json({ message: "Username and password are required." });

  //check for duplicate usernames in the db

  const duplicate = await User.findOne({ username: user }).exec();

  if (duplicate) return res.sendStatus(409); //Confict

  try {
    //encrypt the password
    const hashedPwd = await bcrypt.hash(pwd, 10);

    //create and store the new user
    const result = await User.create({
      username: user,
      password: hashedPwd,
    });

    //or
    // const users = new User({
    //   username: user,
    //   password: hashedPwd,
    // })
    // const insertuser = await users.save();
    // console.log(insertuser)

    console.log(result);
    res.status(201).json({ success: `New User ${user} created!` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { handleNewUser };
