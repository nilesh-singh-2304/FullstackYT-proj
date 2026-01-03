import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {    // request ka json data req m hoga , file m jo file upload ho rhi hh uska data hoga
    cb(null, "./public/temp")   //cb is callback function jisme pehla arg error hota h agr koi error ho toh , agr error nhi h toh null pass krte h , 2nd arg m destination path jaha file save krni h
  },

  filename: function (req, file, cb) {
    // const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    // cb(null, file.fieldname + '-' + uniqueSuffix)

    cb(null, file.originalname)
    // cb(null, file.fieldname)
  }
})

//yeh funcn return krega hme final local file path jaha file save ho rhi hh

export const upload = multer({ storage: storage })


// import multer from "multer";
// import path from "path";
// import fs from "fs";

// const tempDir = path.resolve("public/temp");

// // ✅ ensure folder exists
// if (!fs.existsSync(tempDir)) {
//   fs.mkdirSync(tempDir, { recursive: true });
// }

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, tempDir);
//   },
//   filename: function (req, file, cb) {
//     cb(null, `${Date.now()}-${file.originalname}`);
//   }
// });

// export const upload = multer({
//   storage,
// });
