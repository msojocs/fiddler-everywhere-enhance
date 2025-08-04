package server_test

import (
	"fe-tool/server"
	"log"
	"testing"
)

func TestDownload(t *testing.T) {
	server.Download()
}

func TestExtract(t *testing.T) {
	log.Println("---start---")
	server.Extract()
}
