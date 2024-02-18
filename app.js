const fs = require("fs");
const fsPromises = fs.promises;
(async () => {
  // commands
  const CREATE_FILE = "create a file";
  const DELETE_FILE = "delete a file";

  // createing a function for file creation
  const createANewFile = async (path) => {
    try {
      // we want to check whether or not we already have the file
      const existingFileHandle = await fsPromises.open(path, "r");
      existingFileHandle.close();
      // we already have the file
      return console.log(`The file ${path} already exists`);
    } catch (error) {
      // we dont have the file file we should create it
      const newFileHandle = await fsPromises.open(path, "w");
      console.log(`A new file was successfully created`);
      newFileHandle.close();
    }
  };

  // creating a function for deleting the file

  const deleteFile = async (path) => {
    try {
      await fsPromises.unlink(path);
      console.log("file is deleted successfully");
    } catch (error) {
      if (error.code === "ENOENT") {
        console.log("No file at this path to remove");
      } else {
        console.log("An error occured while removing the file");
        console.log(error);
      }
    }
  };

  const commandFileHandler = await fsPromises.open("./command.txt", "r");

  commandFileHandler.on("change", async () => {
    // get the sze of outr file
    const size = (await commandFileHandler.stat()).size;

    // allocate our buffer with the size of the file
    const buff = Buffer.alloc(size);
    // the location at which we want to fill our buffer
    const offset = 0;
    // how many bytes we want to read
    const length = buff.byteLength;
    // the position we want to start reading the file from
    const position = 0;

    // read the contents of the file
    await commandFileHandler.read(buff, offset, length, position);
    const command = buff.toString("utf-8");

    if (command.includes(CREATE_FILE)) {
      const filePath = command.substring(CREATE_FILE.length + 1);
      createANewFile(filePath);
    }

    if (command.includes(DELETE_FILE)) {
      const filePath = command.substring(DELETE_FILE.length + 1);
      deleteFile(filePath);
    }
  });

  //watcher...
  const watcher = fsPromises.watch("./command.txt");
  for await (const event of watcher) {
    if (event.eventType === "change") {
      //console.log(event, "The file was changed");
      commandFileHandler.emit("change");
    }
  }
})();
