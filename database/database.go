package database

import (
	"context"
	"fmt"
	"log"
	"time"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var HolidayCollection *mongo.Collection

// ConnectDB initializes MongoDB connection
func ConnectDB() {
	clientOptions := options.Client().ApplyURI("mongodb+srv://your-username:your-password@your-cluster.mongodb.net/?retryWrites=true&w=majority")

	client, err := mongo.NewClient(clientOptions)
	if err != nil {
		log.Fatal("Error creating MongoDB client:", err)
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	err = client.Connect(ctx)
	if err != nil {
		log.Fatal("Error connecting to MongoDB:", err)
	}

	HolidayCollection = client.Database("holidayDB").Collection("holidays")
	fmt.Println("✅ Successfully connected to MongoDB!")
}
