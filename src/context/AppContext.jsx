import axios from "axios";
import { createContext, useEffect, useState } from "react";

export const AppContext = createContext()

const ContextProvider = ({ children }) => {

    const[books, setBooks] = useState([])
    const[allBooks, setAllBooks] = useState([]) // For showing all books including duplicates
    const [selectedGenre, setSelectedGenre] = useState("");
    const [selectedType, setSelectedType] = useState("");
    
    const fetchPopularBooks = async () => {
        try {
            const url = "http://localhost:8080/api/v1/books/popular";
            const response = await axios.get(url);
            
            // Remove duplicates based on book title
            const uniqueBooks = response.data.filter((book, index, self) =>
                index === self.findIndex(b => b.bookName?.toLowerCase() === book.bookName?.toLowerCase())
            );
            
            setBooks(uniqueBooks);
            console.log(uniqueBooks);
            return uniqueBooks;
        } catch (error) {
            console.error("Error fetching popular books:", error);
            return [];
        }
    }

    const fetchAllBooks = async () => {
        try {
            const url = "http://localhost:8080/api/v1/books";
            const response = await axios.get(url);
            
            // Don't remove duplicates - show all books
            setAllBooks(response.data);
            console.log("All books (including duplicates):", response.data);
            return response.data;
        } catch (error) {
            console.error("Error fetching all books:", error);
            setAllBooks([]);
            return [];
        }
    }

    useEffect(() => {
        // Only fetch by genre if selectedType is not set and genre is set and not "All Genres"
        if ((!selectedType || selectedType === "All Types") && selectedGenre && selectedGenre !== "All Genres") {
            const fetchBooksByGenre = async () => {
                try {
                    const url = "http://localhost:8080/api/v1/books";
                    const params = { genre: selectedGenre };
                    const response = await axios.get(url, { params });
                    
                    // Remove duplicates based on book title
                    const uniqueBooks = response.data.filter((book, index, self) =>
                        index === self.findIndex(b => b.bookName?.toLowerCase() === book.bookName?.toLowerCase())
                    );
                    
                    setBooks(uniqueBooks);
                    console.log(uniqueBooks)
                } catch (error) {
                    setBooks([]);
                    console.error("Error fetching books by genre:", error);
                }
            };
            fetchBooksByGenre();
        }
        // If neither type nor genre is selected, fetch all books
        else if ((!selectedType || selectedType === "All Types") && (!selectedGenre || selectedGenre === "All Genres")) {
            const fetchAllBooksForFilter = async () => {
                try {
                    const url = "http://localhost:8080/api/v1/books";
                    const response = await axios.get(url);
                    
                    // Remove duplicates based on book title
                    const uniqueBooks = response.data.filter((book, index, self) =>
                        index === self.findIndex(b => b.bookName?.toLowerCase() === book.bookName?.toLowerCase())
                    );
                    
                    setBooks(uniqueBooks);
                    console.log(uniqueBooks)
                } catch (error) {
                    setBooks([]);
                    console.error("Error fetching all books:", error);
                }
            };
            fetchAllBooksForFilter();
        }
    }, [selectedGenre, selectedType]);

    const addBooks = async (newBook) => {
        try {
            const url = "http://localhost:8080/api/v1/books/add";
            const response = await axios.post(url, newBook);
            
            setBooks(prevBooks => [...prevBooks, response.data]);
            console.log("Book added successfully:", response.data);
            return response.data;
        } catch (error) {
            console.error("Error adding book:", error);
            throw error;
        }
    }
    
    return (
        <AppContext.Provider value={{ fetchPopularBooks, fetchAllBooks, books, allBooks, addBooks }}>
            {children}
        </AppContext.Provider>
    )
}

export default ContextProvider