import axios from "axios";
import { createContext, useState } from "react";

export const AppContext = createContext()

const ContextProvider = ({ children }) => {

    const[books, setBooks] = useState([])
    const [selectedGenre, setSelectedGenre] = useState("");
    const [selectedType, setSelectedType] = useState("");
    
    const fetchPopularBooks = async () => {
        try {
            const url = "http://localhost:8080/api/v1/books/popular";
            const response = await axios.get(url);
             return response.data;
        } catch (error) {
            console.error("Error fetching popular books:", error);
            return [];
        }
    }
    
    return (
        <AppContext.Provider value={{ fetchPopularBooks }}>
            {children}
        </AppContext.Provider>
    )
}

export default ContextProvider