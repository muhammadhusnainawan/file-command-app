const fs = require("fs");
const fsPromises = fs.promises;
(async () => {
  // commands
  const CREATE_FILE = "create a file";
  const DELETE_FILE = "delete a file";
  const RENAME_FILE = "rename a file";
  const ADD_TO_FILE = "add to file";

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

  // creaing a function for renaming a file

  const renameFile = async (path, newPath) => {
    try {
      await fsPromises.rename(path, newPath);
      console.log(
        `File name changed from ${path} to new ${newPath} successfully`
      );
    } catch (error) {
      if (error.code === "ENOENT") {
        console.log("No file of this path to rename or the estination exists");
      } else {
        console.log("An error occured while renaming the file");
        console.log(error);
      }
    }
  };

  // creating a function for adding content to file
    let addedContent;
    const addToFile = async (path, content)=>{
      if (addedContent === content) return ;
        try {
       const fileHandle =    await fsPromises.open(path, "a")
          fileHandle.write(content)
          addedContent = content
        } 
        catch (error) {
          console.log(error);
        }
    }

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
// creating file
    if (command.includes(CREATE_FILE)) {
      const filePath = command.substring(CREATE_FILE.length + 1);
      createANewFile(filePath);
    }
//deleting file
    if (command.includes(DELETE_FILE)) {
      const filePath = command.substring(DELETE_FILE.length + 1);
      deleteFile(filePath);
    }
// renaming file
    if (command.includes(RENAME_FILE)) {
      const _idx = command.indexOf(" to ");
      //console.log(_idx);
      const oldPath = command.substring(RENAME_FILE.length + 1, _idx);
      //console.log(oldPath);
      const newPath = command.substring(_idx + 4);
      //console.log(newPath);
      renameFile(oldPath, newPath);
    }
    // adding content to file
    if (command.includes(ADD_TO_FILE)) {
      const _idx = command.indexOf(" this content: ")
      const path = command.substring(ADD_TO_FILE.length + 1, _idx)
      const content = command.substring(_idx + 15 )
      addToFile(path, content)
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
