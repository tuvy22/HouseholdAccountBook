package entity

import "cloud.google.com/go/documentai/apiv1/documentaipb"

type Receipt struct {
	StoreName   string `json:"storeName"`
	TotalAmount int    `json:"totalAmount"`
}
type Token struct {
	Text         string
	BoundingPoly *documentaipb.BoundingPoly
}
