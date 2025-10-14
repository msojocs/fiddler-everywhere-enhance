package fe

import (
	"bufio"
	"fmt"
	"io"
	"log"
	"net/http"
	"net/url"
	"os"
	"os/exec"
	"regexp"
)

const TargetDir = "FiddlerEverywhere"

func Download(version string) string {
	client := http.Client{
		CheckRedirect: func(req *http.Request, via []*http.Request) error {
			return http.ErrUseLastResponse
		},
	}
	log.Println("Downloading FE version:", version)
	link := "https://api.getfiddler.com/linux/latest-linux"
	if version != "latest" {
		resp, err := client.Get(link)
		if err != nil {
			log.Fatalln("Download EF error:" + err.Error())
		}
		defer resp.Body.Close()
		if resp.StatusCode == http.StatusFound {
			link, err := url.QueryUnescape(resp.Header.Get("Location"))
			if err != nil {
				log.Fatalln("URL unescape error:", err)
			}
			log.Println("Redirecting to:", link)
			v := regexp.MustCompile(`\d+\.\d+\.\d+`).FindStringSubmatch(link)
			version = v[0]
		} else {
			log.Fatalln("Unexpected status code:", resp.StatusCode)
		}

	}

	saveFilePath := fmt.Sprintf("cache/fe-%s.AppImage", version)
	if s, err := os.Stat(saveFilePath); err == nil && !s.IsDir() {
		log.Println(saveFilePath + " exists.")

		err = os.Chmod(saveFilePath, 0755)
		if err != nil {
			log.Fatalln("Chmod "+saveFilePath+" error", err)
		}
		return ""
	}
	file, err := os.Create(saveFilePath + ".tmp")
	if err != nil {
		log.Fatalln("Create file error:" + err.Error())
	}
	defer file.Close()

	writer := bufio.NewWriter(file)
	resp, err := client.Get(link)
	if err != nil {
		file.Close()
		log.Fatalln("Download EF error:" + err.Error())
	}
	defer resp.Body.Close()

	fileSize, err := io.Copy(writer, resp.Body)

	file.Close()
	if err != nil {
		log.Fatalln("Write file error:" + err.Error())
	}
	err = os.Rename(saveFilePath+".tmp", saveFilePath)
	if err != nil {
		log.Fatalln("Rename "+saveFilePath+".tmp error", err)
	}
	err = os.Chmod(saveFilePath, 0755)
	if err != nil {
		log.Fatalln("Chmod "+saveFilePath+" error", err)
	}
	log.Println("Download fe end, file size:", fileSize)
	return saveFilePath
}

func Extract(path string) {
	cmd := exec.Command(path, "--appimage-extract")
	err := cmd.Run()
	if err != nil {
		log.Fatalln("AppImage extract error:", err)
	}
	os.RemoveAll("FiddlerEverywhere")
	err = os.Rename("squashfs-root", "FiddlerEverywhere")
	if err != nil {
		log.Fatalln("Rename squashfs error:", err)
	}
}
