import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {    // request ka json data req m hoga , file m jo file upload ho rhi hh uska data hoga
    cb(null, "./public/temp")
  },
  filename: function (req, file, cb) {
    // const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    // cb(null, file.fieldname + '-' + uniqueSuffix)

    // cb(null, file.originalname)
    cb(null, file.fieldname)
  }
})

//yeh funcn return krega hme final local file path jaha file save ho rhi hh

export const upload = multer({ storage: storage })