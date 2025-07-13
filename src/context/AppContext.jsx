import axios from "axios";
import { createContext, useEffect, useState, useRef } from "react";

export const AppContext = createContext();

const ContextProvider = ({ children }) => {
  const [books, setBooks] = useState([]);
  const [allBooks, setAllBooks] = useState([]);
  const [members, setMembers] = useState([]); // For showing all books including duplicates
  const [selectedGenre, setSelectedGenre] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const lastFetchParams = useRef(null); // Track last fetch to prevent duplicates
  const [librarians, setLibrarians] = useState([]);

  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem("isAuthenticated") === "true";
  });

  // Login function
  const login = async (email, password) => {
    try {
      const response = await axios.post(
        "http://localhost:8080/api/v1/admins/auth/login",
        {
          email,
          password,
        }
      );

      if (response.data === true) {
        // Create user object with email
        const userData = { email };

        // Update state
        setUser(userData);
        setIsAuthenticated(true);

        // Store in localStorage
        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("isAuthenticated", "true");

        return { success: true, message: "Login successful" };
      } else {
        return { success: false, message: "Invalid credentials" };
      }
    } catch (error) {
      console.error("Login error:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Login failed",
      };
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);

    // Clear localStorage
    localStorage.removeItem("user");
    localStorage.removeItem("isAuthenticated");
  };

  const fetchPopularBooks = async () => {
    try {
      const url = "http://localhost:8080/api/v1/books/popular";
      const response = await axios.get(url);

      // Remove duplicates based on book title
      const uniqueBooks = response.data.filter(
        (book, index, self) =>
          index ===
          self.findIndex(
            (b) => b.bookName?.toLowerCase() === book.bookName?.toLowerCase()
          )
      );

      setBooks(uniqueBooks);
      console.log(uniqueBooks);
      return uniqueBooks;
    } catch (error) {
      console.error("Error fetching popular books:", error);
      return [];
    }
  };

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
  };

  useEffect(() => {
    let isMounted = true; // Flag to prevent state updates if component unmounts

    const fetchBooks = async () => {
      // Create params object for comparison
      const currentParams = {
        genre:
          selectedGenre && selectedGenre !== "All Genres"
            ? selectedGenre
            : null,
        type:
          selectedType && selectedType !== "All Types" ? selectedType : null,
      };

      // Check if we already fetched with these exact parameters
      if (
        lastFetchParams.current &&
        JSON.stringify(currentParams) ===
          JSON.stringify(lastFetchParams.current)
      ) {
        return; // Skip if same parameters
      }

      setIsLoading(true);
      lastFetchParams.current = currentParams;

      try {
        let url = "http://localhost:8080/api/v1/books";
        let params = {};

        // Only fetch by genre if selectedType is not set and genre is set and not "All Genres"
        if (
          (!selectedType || selectedType === "All Types") &&
          selectedGenre &&
          selectedGenre !== "All Genres"
        ) {
          params = { genre: selectedGenre };
        }

        const response = await axios.get(url, { params });

        if (isMounted) {
          // Remove duplicates based on book title
          const uniqueBooks = response.data.filter(
            (book, index, self) =>
              index ===
              self.findIndex(
                (b) =>
                  b.bookName?.toLowerCase() === book.bookName?.toLowerCase()
              )
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
    if (
      (!selectedType || selectedType === "All Types") &&
      (!selectedGenre ||
        selectedGenre === "All Genres" ||
        (selectedGenre && selectedGenre !== "All Genres"))
    ) {
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

      setBooks((prevBooks) => [...prevBooks, response.data]);
      console.log("Book added successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error adding book:", error);
      throw error;
    }
  };

  const deleteBook = async (bookId) => {
    try {
      const url = `http://localhost:8080/api/v1/books/${bookId}`;
      await axios.delete(url);
      setBooks((prevBooks) =>
        prevBooks.filter((book) => book.bookId !== bookId)
      );
      console.log("Book deleted successfully:", bookId);
    } catch (error) {
      console.error("Error deleting book:", error);
      throw error;
    }
  };

  const fetchAllMembers = async () => {
    try {
      const url = "http://localhost:8080/api/v1/members";
      const response = await axios.get(url);
      console.log("All members fetched:", response.data);
      setMembers(response.data || []); // Ensure it's always an array
      return response.data || [];
    } catch (error) {
      console.error("Error fetching all members:", error);
      setMembers([]); // Set to empty array on error
      return [];
    }
  };

  const addMembers = async (newMember) => {
    try {
      const url = "http://localhost:8080/api/v1/members";
      const response = await axios.post(url, newMember);
      setMembers((prevMembers) => [...prevMembers, response.data]);
      console.log("Member added successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error adding member:", error);
      throw error;
    }
  };

  const deleteMember = async (memberId) => {
    try {
      const url = `http://localhost:8080/api/v1/members/${memberId}`;
      await axios.delete(url);
      setMembers((prevMembers) =>
        prevMembers.filter((member) => member.memberId !== memberId)
      );
      console.log("Member deleted successfully:", memberId);
    } catch (error) {
      console.error("Error deleting member:", error);
      throw error;
    }
  };

  useEffect(() => {
    fetchAllMembers();
  }, []);

  const editMember = async (memberId, updatedData) => {
    try {
      const url = `http://localhost:8080/api/v1/members/${memberId}`;
      const response = await axios.put(url, updatedData);
      console.log("Member updated successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error updating member:", error);
      throw error;
    }
  };

  const fetchIssuedBooks = async () => {
    try {
      const url = "http://localhost:8080/api/v1/borrowings";
      const response = await axios.get(url);
      console.log("Issued books fetched:", response.data);

      // Get unique member and book IDs to reduce API calls
      const memberIds = [...new Set(response.data.map((b) => b.memberId))];
      const bookIds = [...new Set(response.data.map((b) => b.bookId))];

      // Fetch all unique members and books in parallel batches
      const [memberDetailsMap, bookDetailsMap] = await Promise.all([
        // Fetch members in smaller batches to prevent resource exhaustion
        fetchMembersByIds(memberIds),
        fetchBooksByIds(bookIds),
      ]);

      // Map the borrowings with their details
      const borrowingsWithFullDetails = response.data.map((borrowing) => {
        const memberDetails = memberDetailsMap[borrowing.memberId] || null;
        const bookDetails = bookDetailsMap[borrowing.bookId] || null;

        return {
          ...borrowing,
          memberDetails,
          borrowerName: memberDetails?.name || "Unknown Member",
          borrowerEmail: memberDetails?.email || "N/A",
          borrowerPhone: memberDetails?.phoneNumber || "N/A",
          borrowerAddress: memberDetails?.address || "N/A",
          bookDetails,
          bookName: bookDetails?.bookName || "Unknown Book",
          author: bookDetails?.author || "Unknown Author",
          isbn: bookDetails?.isbn || "N/A",
          genre: bookDetails?.genre || "N/A",
          imageUrl: bookDetails?.imageUrl || null,
        };
      });

      console.log("Issued books with full details:", borrowingsWithFullDetails);
      return borrowingsWithFullDetails;
    } catch (error) {
      console.error("Error fetching issued books:", error);
      throw error;
    }
  };

  // Helper function to fetch members by IDs in batches
  const fetchMembersByIds = async (memberIds) => {
    const memberDetailsMap = {};
    const batchSize = 5; // Process 5 members at a time

    for (let i = 0; i < memberIds.length; i += batchSize) {
      const batch = memberIds.slice(i, i + batchSize);
      const batchPromises = batch.map(async (memberId) => {
        try {
          const response = await axios.get(
            `http://localhost:8080/api/v1/members/${memberId}`
          );
          return { id: memberId, data: response.data };
        } catch (error) {
          console.error(`Error fetching member ${memberId}:`, error);
          return { id: memberId, data: null };
        }
      });

      const batchResults = await Promise.all(batchPromises);
      batchResults.forEach((result) => {
        memberDetailsMap[result.id] = result.data;
      });

      // Small delay between batches to prevent overwhelming the server
      if (i + batchSize < memberIds.length) {
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
    }

    return memberDetailsMap;
  };

  // Helper function to fetch books by IDs in batches
  const fetchBooksByIds = async (bookIds) => {
    const bookDetailsMap = {};
    const batchSize = 5; // Process 5 books at a time

    for (let i = 0; i < bookIds.length; i += batchSize) {
      const batch = bookIds.slice(i, i + batchSize);
      const batchPromises = batch.map(async (bookId) => {
        try {
          const response = await axios.get(
            `http://localhost:8080/api/v1/books/${bookId}`
          );
          return { id: bookId, data: response.data };
        } catch (error) {
          console.error(`Error fetching book ${bookId}:`, error);
          return { id: bookId, data: null };
        }
      });

      const batchResults = await Promise.all(batchPromises);
      batchResults.forEach((result) => {
        bookDetailsMap[result.id] = result.data;
      });

      // Small delay between batches to prevent overwhelming the server
      if (i + batchSize < bookIds.length) {
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
    }

    return bookDetailsMap;
  };

  const updateBorrowings = async (borrowing, id) => {
    try {
      const url = `http://localhost:8080/api/v1/borrowings/${id}`;
      const response = await axios.put(url, borrowing);
      console.log("Borrowings updated successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error updating borrowings:", error);
      throw error;
    }
  };

  // Function to create a new borrowing (issue a book)
  const createBorrowing = async (borrowingData) => {
    try {
      const url = "http://localhost:8080/api/v1/borrowings";
      const response = await axios.post(url, borrowingData);
      console.log("Borrowing created successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error creating borrowing:", error);
      throw error;
    }
  };

  // Function to update book details (including availability status and quantity)
  const updateBook = async (bookId, bookData) => {
    try {
      const url = `http://localhost:8080/api/v1/books/${bookId}`;
      const response = await axios.put(url, bookData);
      console.log("Book updated successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error updating book:", error);
      throw error;
    }
  };

  // Function to fetch all librarians
  const getAllLibrarians = async () => {
    try {
      const url = "http://localhost:8080/api/v1/librarians";
      const response = await axios.get(url);
      console.log("All librarians fetched:", response.data);
      setLibrarians(response.data || []);
      return response.data;
    } catch (error) {
      console.error("Error fetching all librarians:", error);
      return [];
    }
  };

  const addLibrarian = async (newLibrarian) => {
    try {
      const url = "http://localhost:8080/api/v1/librarians";
      const response = await axios.post(url, newLibrarian);
      console.log("Librarian added successfully:", response.data);

      // Refresh the librarians list after successful addition
      await getAllLibrarians();

      return response.data;
    } catch (error) {
      console.error("Error adding librarian:", error);
      throw error;
    }
  };

  useEffect(() => {
    getAllLibrarians();
  }, []);

  const editLibrarian = async (librarianId, updatedData) => {
    try {
      const url = `http://localhost:8080/api/v1/librarians/${librarianId}`;
      const response = await axios.put(url, updatedData);
      console.log("Librarian updated successfully:", response.data);

      // Refresh the librarians list after successful update
      await getAllLibrarians();

      return response.data;
    } catch (error) {
      console.error("Error updating librarian:", error);
      throw error;
    }
  };

  const deleteLibrarian = async (librarianId) => {
    try {
      const url = `http://localhost:8080/api/v1/librarians/${librarianId}`;
      await axios.delete(url);
      console.log("Librarian deleted successfully:", librarianId);

      // Refresh the librarians list after successful deletion
      await getAllLibrarians();

      return true; // Indicate success
    } catch (error) {
      console.error("Error deleting librarian:", error);
      throw error;
    }
  };

  return (
    <AppContext.Provider
      value={{
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
        members,
        setMembers,
        editMember,
        fetchAllMembers,
        addMembers,
        deleteMember,
        deleteBook,
        updateBorrowings,
        createBorrowing,
        updateBook,
        user,
        isAuthenticated,
        login,
        logout,
        addLibrarian,
        librarians,
        editLibrarian,
        deleteLibrarian,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default ContextProvider;
