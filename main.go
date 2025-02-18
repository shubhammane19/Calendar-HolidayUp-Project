package main

import (
	"context"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

// MongoDB Collection
var holidayCollection *mongo.Collection

// Holiday struct
type Holiday struct {
	Date string `json:"date" bson:"date"`
	Name string `json:"name" bson:"name"`
}

// ConnectDB initializes MongoDB connection
func ConnectDB() {
	clientOptions := options.Client().ApplyURI("mongodb+srv://shubhammane:Mane%402003@cluster0.w5db9.mongodb.net/?retryWrites=true&w=majority")
	client, err := mongo.Connect(context.Background(), clientOptions)
	if err != nil {
		log.Fatal(err)
	}

	err = client.Ping(context.Background(), nil)
	if err != nil {
		log.Fatal("Failed to connect to MongoDB:", err)
	}

	holidayCollection = client.Database("holidayDB").Collection("holidays")
	log.Println("Successfully connected to MongoDB!")
}

// GetHolidays fetches all holidays
func GetHolidays(c *gin.Context) {
	var holidays []Holiday
	cursor, _ := holidayCollection.Find(context.Background(), bson.M{})
	cursor.All(context.Background(), &holidays)
	c.JSON(http.StatusOK, holidays)
}

// AddHoliday adds a new holiday
func AddHoliday(c *gin.Context) {
	var newHoliday Holiday
	if err := c.ShouldBindJSON(&newHoliday); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	holidayCollection.InsertOne(context.Background(), newHoliday)
	c.JSON(http.StatusOK, newHoliday)
}

// DeleteHoliday deletes a holiday by date
func DeleteHoliday(c *gin.Context) {
	date := c.Param("date")
	holidayCollection.DeleteOne(context.Background(), bson.M{"date": date})
	c.JSON(http.StatusOK, gin.H{"message": "Holiday deleted"})
}

func main() {
	ConnectDB()

	// Initialize Gin router
	r := gin.Default()

	// Define API routes
	r.GET("/holidays", GetHolidays)
	r.POST("/holidays", AddHoliday)
	r.DELETE("/holidays/:date", DeleteHoliday)

	// Start the server
	r.Run(":8080")
}
