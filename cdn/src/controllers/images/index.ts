import { gfs } from "../../server";

export const uploadImage = async (req, res) => {
  try {
    if (req.file === undefined) {
      res.json({
        msg: "File not uploaded",
        success: false
      });
    } else {
      res.json({
        msg: req.file.filename,
        success: true
      });
    }
  } catch (error) {
    console.log("error in controllers/images/index.ts/uploadImage =>", error);
    res.json({
      msg: "Error",
      success: false
    });
  }
};

export const getImage = async (req, res) => {
  try {
    const file = await gfs.files.findOne({ filename: req.params.filename });
    const readStream = gfs.createReadStream(file.filename);
    readStream.pipe(res);
  } catch (error) {
    res.send("Image not found");
  }
};

export const deleteImage = async (req, res) => {
  try {
    const file = await gfs.files.findOne({
      filename: req.params.filename
    });

    await gfs.files.deleteOne({
      _id: file._id
    });

    gfs.db
      .collection("photos" + ".chunks")
      .remove({ files_id: file._id }, function(err) {});

    res.json({
      msg: "Image deleted",
      success: true
    });
  } catch (error) {
    console.log("error in controllers/images/index.ts/deleteImage =>", error);
    res.json({
      msg: "Error",
      success: false
    });
  }
};

// export const secretThings = async (req, res) => {
//   try {
//     const aux: Array<string> = [
//       "1658296745674-penguin (8).jpg",
//       "1657833678365-fbu.png",
//       "1657697806622-Google.jpg",
//       "1657642263982-metaLogo.png",
//       "1657642678321-fbu.png",
//       "1658161169148-1db918fe2b5dff69f35186ad20cc1752.jpg"
//     ];

//     await gfs.files.find().toArray(async function(err, files) {
//       for (let i = 0; i < files.length; i++) {
//         if (aux.indexOf(files[i].filename) === -1) {
//           const file = await gfs.files.findOne({
//             filename: files[i].filename
//           });

//           await gfs.files.deleteOne({
//             _id: file._id
//           });

//           gfs.db
//             .collection("photos" + ".chunks")
//             .remove({ files_id: file._id }, function(err) {});
//         }
//       }

//       console.log("it finished");
//     });
//     res.send("xd");
//   } catch (error) {
//     res.send("Image not found");
//   }
// };
