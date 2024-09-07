const Header = () => {
  return (
    // <header className="w-full">
    //   <nav className="bg-white border-gray-200 px-4 lg:px-6 py-2.5 dark:bg-gray-800">
    //     <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
    //       <a href="https://flowbite.com" className="flex items-center">
    //         <img
    //           src="https://flowbite.com/docs/images/logo.svg"
    //           className="mr-3 h-6 sm:h-9"
    //           alt="Flowbite Logo"
    //         />
    //         <span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white">
    //           Flowbite
    //         </span>
    //       </a>
    //       <div className="flex items-center lg:order-2">
    //         <a
    //           href="/login"
    //           className="text-gray-800 dark:text-white hover:bg-gray-50 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 dark:hover:bg-gray-700 focus:outline-none dark:focus:ring-gray-800"
    //         >
    //           Log in
    //         </a>
    //         <a
    //           href="#"
    //           className="text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800"
    //         >
    //           Get started
    //         </a>
    //         <button
    //           data-collapse-toggle="mobile-menu-2"
    //           type="button"
    //           className="inline-flex items-center p-2 ml-1 text-sm text-gray-500 rounded-lg lg:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
    //           aria-controls="mobile-menu-2"
    //           aria-expanded="false"
    //         >
    //           <span className="sr-only">Open main menu</span>
    //           <svg
    //             className="w-6 h-6"
    //             fill="currentColor"
    //             viewBox="0 0 20 20"
    //             xmlns="http://www.w3.org/2000/svg"
    //           >
    //             <path
    //               fillRule="evenodd"
    //               d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
    //               clipRule="evenodd"
    //             ></path>
    //           </svg>
    //           <svg
    //             className="hidden w-6 h-6"
    //             fill="currentColor"
    //             viewBox="0 0 20 20"
    //             xmlns="http://www.w3.org/2000/svg"
    //           >
    //             <path
    //               fillRule="evenodd"
    //               d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
    //               clipRule="evenodd"
    //             ></path>
    //           </svg>
    //         </button>
    //       </div>
    //       <div
    //         className="hidden justify-between items-center w-full lg:flex lg:w-auto lg:order-1"
    //         id="mobile-menu-2"
    //       >
    //         <ul className="flex flex-col mt-4 font-medium lg:flex-row lg:space-x-8 lg:mt-0">
    //           <li>
    //             <a
    //               href="#"
    //               className="block py-2 pr-4 pl-3 text-white rounded bg-primary-700 lg:bg-transparent lg:text-primary-700 lg:p-0 dark:text-white"
    //               aria-current="page"
    //             >
    //               Home
    //             </a>
    //           </li>
    //           <li>
    //             <a
    //               href="#"
    //               className="block py-2 pr-4 pl-3 text-gray-700 border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-primary-700 lg:p-0 dark:text-gray-400 lg:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white lg:dark:hover:bg-transparent dark:border-gray-700"
    //             >
    //               Company
    //             </a>
    //           </li>
    //           <li>
    //             <a
    //               href="#"
    //               className="block py-2 pr-4 pl-3 text-gray-700 border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-primary-700 lg:p-0 dark:text-gray-400 lg:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white lg:dark:hover:bg-transparent dark:border-gray-700"
    //             >
    //               Marketplace
    //             </a>
    //           </li>
    //           <li>
    //             <a
    //               href="#"
    //               className="block py-2 pr-4 pl-3 text-gray-700 border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-primary-700 lg:p-0 dark:text-gray-400 lg:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white lg:dark:hover:bg-transparent dark:border-gray-700"
    //             >
    //               Features
    //             </a>
    //           </li>
    //           <li>
    //             <a
    //               href="#"
    //               className="block py-2 pr-4 pl-3 text-gray-700 border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-primary-700 lg:p-0 dark:text-gray-400 lg:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white lg:dark:hover:bg-transparent dark:border-gray-700"
    //             >
    //               Team
    //             </a>
    //           </li>
    //           <li>
    //             <a
    //               href="#"
    //               className="block py-2 pr-4 pl-3 text-gray-700 border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-primary-700 lg:p-0 dark:text-gray-400 lg:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white lg:dark:hover:bg-transparent dark:border-gray-700"
    //             >
    //               Contact
    //             </a>
    //           </li>
    //         </ul>
    //       </div>
    //     </div>
    //   </nav>
    // </header>


    <header className="fixed top-0 left-0 right-0 z-50">
    <nav className="bg-black">
      <div className="xl:container mx-auto px-3 sm:px-4 xl:px-2">
        <div className="flex justify-between">
          <div className="mx-w-10 text-2xl font-bold capitalize text-white flex items-center">VIỆC LÀM IT</div>

          <div className="flex flex-row">
            <ul className="navbar hidden lg:flex lg:flex-row text-gray-400 text-lg items-center font-bold">
              <li className="relative border-l border-gray-800 hover:bg-gray-900 group">
                <a className="block py-3 px-6 border-b-2 border-transparent" href="index.html">Home</a>
              </li>
              <li className="relative border-l border-gray-800 hover:bg-gray-900 group">
                <a className="block py-3 px-6 border-b-2 border-transparent" href="#">Pages</a>
                <ul className="dropdown-menu absolute left-0 top-full z-50 bg-white text-gray-700 border border-gray-100 hidden group-hover:block" style={{ minWidth: '12rem' }}>
                  <li className="subdropdown relative hover:bg-gray-50">
                    <a className="block py-2 px-6 border-b border-gray-100" href="#">Homepage</a>
                    <ul className="dropdown-menu absolute left-full top-0 hidden bg-white border border-gray-100 group-hover:block" style={{ minWidth: '12rem' }}>
                      <li className="relative hover:bg-gray-50"><a className="block py-2 px-6 border-b border-gray-100" href="index.html">Homepage 1</a></li>
                      <li className="relative hover:bg-gray-50"><a className="block py-2 px-6 border-b border-gray-100" href="index-2.html">Homepage 2</a></li>
                    </ul>
                  </li>
                  <li className="subdropdown relative hover:bg-gray-50">
                    <a className="block py-2 px-6 border-b border-gray-100" href="#">Pages</a>
                    <ul className="dropdown-menu absolute left-full top-0 hidden bg-white border border-gray-100 group-hover:block" style={{ minWidth: '12rem' }}>
                      <li className="relative hover:bg-gray-50"><a className="block py-2 px-6 border-b border-gray-100" href="404.html">404</a></li>
                      <li className="relative hover:bg-gray-50"><a className="block py-2 px-6 border-b border-gray-100" href="author.html">Author</a></li>
                      <li className="relative hover:bg-gray-50"><a className="block py-2 px-6 border-b border-gray-100" href="category.html">Category</a></li>
                      <li className="relative hover:bg-gray-50"><a className="block py-2 px-6 border-b border-gray-100" href="search.html">Search</a></li>
                      <li className="relative hover:bg-gray-50"><a className="block py-2 px-6 border-b border-gray-100" href="page.html">Page</a></li>
                      <li className="relative hover:bg-gray-50"><a className="block py-2 px-6 border-b border-gray-100" href="contact-us.html">Contact</a></li>
                    </ul>
                  </li>
                  <li className="subdropdown relative hover:bg-gray-50">
                    <a className="block py-2 px-6 border-b border-gray-100" href="#">Post</a>
                    <ul className="dropdown-menu absolute left-full top-0 hidden bg-white border border-gray-100 group-hover:block" style={{ minWidth: '12rem' }}>
                      <li className="relative hover:bg-gray-50"><a className="block py-2 px-6 border-b border-gray-100" href="single.html">Post default</a></li>
                      <li className="relative hover:bg-gray-50"><a className="block py-2 px-6 border-b border-gray-100" href="single-2.html">Post fullwidth</a></li>
                    </ul>
                  </li>
                  <li className="subdropdown relative hover:bg-gray-50">
                    <a className="block py-2 px-6 border-b border-gray-100" href="#">Documentation</a>
                    <ul className="dropdown-menu absolute left-full top-0 hidden bg-white border border-gray-100 group-hover:block" style={{ minWidth: '12rem' }}>
                      <li className="relative hover:bg-gray-50"><a className="block py-2 px-6 border-b border-gray-100" href="docs/index.html">Get started</a></li>
                      <li className="relative hover:bg-gray-50"><a className="block py-2 px-6 border-b border-gray-100" href="docs/components.html">Components</a></li>
                      <li className="relative hover:bg-gray-50"><a className="block py-2 px-6 border-b border-gray-100" href="docs/credits.html">Credits</a></li>
                      <li className="relative hover:bg-gray-50"><a className="block py-2 px-6 border-b border-gray-100" href="docs/changelogs.html">Changelogs</a></li>
                    </ul>
                  </li>
                </ul>
              </li>
              <li className="relative border-l border-gray-800 hover:bg-gray-900">
                <a className="block py-3 px-6 border-b-2 border-transparent" href="#">Sport</a>
                </li>
                <li className="relative border-l border-gray-800 hover:bg-gray-900">
                  <a
                    className="block py-3 px-6 border-b-2 border-transparent"
                    href="#"
                  >
                    Travel
                  </a>
                </li>
                <li className="relative border-l border-gray-800 hover:bg-gray-900">
                  <a
                    className="block py-3 px-6 border-b-2 border-transparent"
                    href="#"
                  >
                    Techno
                  </a>
                </li>
                <li className="relative border-l border-gray-800 hover:bg-gray-900">
                  <a
                    className="block py-3 px-6 border-b-2 border-transparent"
                    href="#"
                  >
                    Worklife
                  </a>
                </li>
                <li className="relative border-l border-gray-800 hover:bg-gray-900">
                  <a
                    className="block py-3 px-6 border-b-2 border-transparent"
                    href="#"
                  >
                    Future
                  </a>
                </li>
                <li className="relative border-l border-gray-800 hover:bg-gray-900">
                  <a
                    className="block py-3 px-6 border-b-2 border-transparent"
                    href="#"
                  >
                    More
                  </a>
                </li>
              </ul>

              <div className="flex flex-row items-center text-gray-300">
                <div className="search-dropdown relative border-r lg:border-l border-gray-800 hover:bg-gray-900">
                  <button className="block py-3 px-6 border-b-2 border-transparent">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M13.126 12.126a5.75 5.75 0 1 0-1 1l3.451 3.45a.5.5 0 0 0 .708-.707l-3.45-3.45a.5.5 0 0 0-.709-.001ZM10 15a6 6 0 1 1 0-12 6 6 0 0 1 0 12Z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>

          

                

              

                <div className="border-r border-gray-800 hover:bg-gray-900">
                  
                </div>

                <div className="relative border-r lg:border-l border-gray-800 hover:bg-gray-900">
                  
                </div>
              </div>

            
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};


export default Header;
