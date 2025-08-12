// import React, { createContext, useState, useContext } from "react";

// // Create a context
// const DrawerContext = createContext();

// // Custom hook to use the drawer context
// export const useDrawer = () => useContext(DrawerContext);

// // Drawer Provider component
// export const DrawerProvider = ({ children }) => {
//   const [isOpen, setIsOpen] = useState(true);

//   const openDrawer = () => setIsOpen(!isOpen);
  

//   return (
//     <DrawerContext.Provider value={{ isOpen, openDrawer, setIsOpen }}>
//       {children}
//     </DrawerContext.Provider>
//   );
// };