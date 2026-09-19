package patch

import (
	"io"
	"log"
	"os"
	"strings"
)

func Download() {
	log.Println("Downloading fiddler.dll ......")
	err := download("https://github.com/project-yui/Yui-patch/releases/download/v1.1.3/yui-fiddler-win32-x86_64-v1.1.3.dll", "cache/fiddler.dll")
	if err != nil {
		log.Fatalln("Download fiddler.dll error:", err)
	}
}
func replaceFiddler(version string) {

	verInfo := strings.Split(version, ".")
	name := "fiddler.dll"
	if verInfo[0] <= "5" && verInfo[1] <= "16" {
		name = "libfiddler.dll"
	}
	os.Remove("FiddlerEverywhere/" + name)
	fiddlerFileDst, err := os.Create("FiddlerEverywhere/" + name)
	if err != nil {
		log.Fatalln("Open FiddlerEverywhere/"+name+" file error:", err)
	}
	defer fiddlerFileDst.Close()
	fiddlerFileSrc, err := os.Open("cache/fiddler.dll")
	if err != nil {
		log.Fatalln("Open cache/"+name+" file error:", err)
	}
	defer fiddlerFileSrc.Close()
	io.Copy(fiddlerFileDst, fiddlerFileSrc)
}
