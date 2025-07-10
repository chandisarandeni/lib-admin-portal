import axios from "axios";
import { createContext, useEffect, useState, useRef } from "react";

export const AppContext = createContext()

const ContextProvider = ({ children }) => {

    const[books, setBooks] = useState([])
    const[allBooks, setAllBooks] = useState([]) // For showing all books including duplicates
    const [selectedGenre, setSelectedGenre] = useState("");
    const [selectedType, setSelectedType] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const lastFetchParams = useRef(null); // Track last fetch to prevent duplicates
    
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
        let isMounted = true; // Flag to prevent state updates if component unmounts
        
        const fetchBooks = async () => {
            // Create params object for comparison
            const currentParams = {
                genre: selectedGenre && selectedGenre !== "All Genres" ? selectedGenre : null,
                type: selectedType && selectedType !== "All Types" ? selectedType : null
            };
            
            // Check if we already fetched with these exact parameters
            if (lastFetchParams.current && 
                JSON.stringify(currentParams) === JSON.stringify(lastFetchParams.current)) {
                return; // Skip if same parameters
            }
            
            setIsLoading(true);
            lastFetchParams.current = currentParams;
            
            try {
                let url = "http://localhost:8080/api/v1/books";
                let params = {};
                
                // Only fetch by genre if selectedType is not set and genre is set and not "All Genres"
                if ((!selectedType || selectedType === "All Types") && selectedGenre && selectedGenre !== "All Genres") {
                    params = { genre: selectedGenre };
                }
                
                const response = await axios.get(url, { params });
                
                if (isMounted) {
                    // Remove duplicates based on book title
                    const uniqueBooks = response.data.filter((book, index, self) =>
                        index === self.findIndex(b => b.bookName?.toLowerCase() === book.bookName?.toLowerCase())
                    );
                    
                    setBooks(uniqueBooks);
                    console.log("Books fetched:", uniqueBooks.length, "books");
                }
            } catch (error) {
                if (isMounted) {
                    setBooks([]);
                    console.error("Error fetching books:", error);
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };

        // Only fetch if we have meaningful filter criteria or want all books
        if ((!selectedType || selectedType === "All Types") && 
            ((!selectedGenre || selectedGenre === "All Genres") || 
             (selectedGenre && selectedGenre !== "All Genres"))) {
            fetchBooks();
        }

        return () => {
            isMounted = false; // Cleanup function to prevent state updates after unmount
        };
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

    const fetchIssuedBooks = async () => {
        try {
            const url = "http://localhost:8080/api/v1/borrowings";
            const response = await axios.get(url);
            console.log("Issued books fetched:", response.data);
            return response.data;
        } catch (error) {
            console.error("Error fetching issued books:", error);
            throw error;
        }
    }

    const fetchAllMembers = async () => {
        try {
            const url = "http://localhost:8080/api/v1/members";
            const response = await axios.get(url);
            console.log("All members fetched:", response.data);
            return response.data;
        } catch (error) {
            console.error("Error fetching all members:", error);
            throw error;
        }
    }
    
    return (
        <AppContext.Provider value={{ 
            fetchPopularBooks, 
            fetchAllBooks, 
            books, 
            allBooks, 
            addBooks, 
            isLoading,
            selectedGenre,
            setSelectedGenre,
            selectedType,
            setSelectedType,
            fetchIssuedBooks,
            fetchAllMembers
        }}>
            {children}
        </AppContext.Provider>
    )
}

export default ContextProvider