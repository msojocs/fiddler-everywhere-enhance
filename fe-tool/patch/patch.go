package patch

import (
	"io"
	"log"
	"os"
)

func Apply() {
	log.Println("Apply patch.")
	os.RemoveAll("FiddlerEverywhere/resources/app/out/file")
	// 2. Copy server/file -> fe/resources/app/out/file
	err := os.Rename("fiddler-everywhere-enhance-main/server/file", "FiddlerEverywhere/resources/app/out/file")
	if err != nil {
		log.Fatalln("Move server file error:", err)
	}
	// 3. Copy fe/resources/app/out/main.js to fe/resources/app/out/main.original.js
	err = os.Rename("FiddlerEverywhere/resources/app/out/main.js", "FiddlerEverywhere/resources/app/out/main.original.js")
	if err != nil {
		log.Fatalln("Rename main.js to main.original.js error:", err)
	}
	// 4. Prepend server/index.js to fe/resources/app/out/main.js
	err = os.Rename("fiddler-everywhere-enhance-main/server/index.js", "FiddlerEverywhere/resources/app/out/main.js")
	if err != nil {
		log.Fatalln("Move server/index.js to main.js error:", err)
	}
	mainFile, err := os.OpenFile("FiddlerEverywhere/resources/app/out/main.js", os.O_APPEND|os.O_WRONLY, 0644)
	if err != nil {
		log.Fatalln("Open main.js file error:", err)
	}
	defer mainFile.Close()

	originalFile, err := os.Open("FiddlerEverywhere/resources/app/out/main.original.js")
	if err != nil {
		log.Fatalln("Open main.original.js file error:", err)
	}
	defer originalFile.Close()

	log.Println("Append main.js")
	_, err = io.Copy(mainFile, originalFile)
	if err != nil {
		log.Fatalln("Append main.js error:", err)
	}

	replaceFiddler()
	log.Println("Apply end.")
}
