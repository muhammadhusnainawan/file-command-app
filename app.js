const fs = require("fs");
const fsPromises = fs.promises;
(async () => {
  const commandFileHandler = await fsPromises.open("./command.txt", "r");
  const watcher = fsPromises.watch("./command.txt");

  for await (const event of watcher) {
    if (event.eventType === "change") {
      console.log(event, "The file was changed");
    }

    const size = (await commandFileHandler.stat()).size;
    const buff = Buffer.alloc(size);
    const offset = 0;
    const length = buff.byteLength;
    const position = 0;

    // read the contents of the file
    const content = await commandFileHandler.read(
      buff,
      offset,
      length,
      position
    );
    console.log("content is", content);
  }
})();
