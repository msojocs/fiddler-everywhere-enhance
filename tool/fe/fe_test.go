package fe_test

import (
	"fe-tool/fe"
	"log"
	"testing"
)

func TestDownload(t *testing.T) {
	fe.Download()
}

func TestExtract(t *testing.T) {
	log.Println("---start---")
	fe.Extract()
}
