const fs = require("fs");
const fsPromises = fs.promises;
(async () => {
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
    const content = await commandFileHandler.read(
      buff,
      offset,
      length,
      position
    );
    console.log("content is", content);
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
