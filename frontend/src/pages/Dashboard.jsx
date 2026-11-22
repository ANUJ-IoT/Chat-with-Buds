import { useEffect, useState, useRef } from "react";
import BackImage from "../assets/ChatAppBack.png";
import {
  Search,
  Send,
  EllipsisVertical,
  UserIcon,
  Menu,
  LogOut,
  Sun,
  Moon,
  Settings,
} from "lucide-react";
import { useAuth } from "../context/Context";
import { useTheme } from "../context/ThemeContext";
import { useNavigate } from "react-router-dom";
import {
  createConversations,
  getConversations,
  getMessages,
  searchUser,
  sendMessages,
} from "../api";
import ContactCard from "../components/contactCard";
import { dynaura } from "dynaura";

export default function Dashboard() {
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();
  const [showMenu, setShowMenu] = useState(false);
  const [selected, setSelected] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [messages, setMessages] = useState([]);
  const searchRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const navigate = useNavigate();

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  const toggletheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const logout = () => {
    dynaura.success({
      title: "Loggin Out.",
      description: "Hope to see you soon...",
    });
    setTimeout(() => {
      navigate("/");
    }, 1200);
  };

  useEffect(() => {
    if (!user) navigate("/");

    async function fetchConversations() {
      const response = await getConversations(user.id);
      setContacts(response.data);
    }

    fetchConversations();
  }, [user, navigate]);

  useEffect(() => {
    if (!selected) return;

    async function fetchMessages() {
      setMessages([]);
      const response = await getMessages(selected);
      setMessages(response.data);
    }
    fetchMessages();
  }, [selected]);

  useEffect(() => {
    function handleOutSideClick(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchResults([]);
        setSearchQuery("");
      }
    }
    document.addEventListener("mousedown", handleOutSideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutSideClick);
    };
  }, []);

  async function handleMessage(e) {
    e.preventDefault();

    const response = await sendMessages({
      conversation_id: selected,
      sender_id: user.id,
      content: newMessage,
    });

    if (response.message === "Message Sent Successfully.") {
      setContacts((prevConversations) => {
        const updatedConversations = prevConversations.find(
          (conversations) => String(conversations.id) === String(selected),
        );

        if (!updatedConversations) return prevConversations;

        const remaining = prevConversations.filter(
          (conversation) => String(conversation.id) !== String(selected),
        );
        return [
          { ...updatedConversations, last_message: newMessage },
          ...remaining,
        ];
      });
      setNewMessage("");

      const updatedMessages = await getMessages(selected);
      setMessages(updatedMessages.data);
    }
  }

  async function handleSearch(e) {
    e.preventDefault();
    const result = await searchUser({
      username: searchQuery,
      user_id: user.id,
    });

    if (result) setSearchResults(result.data);
  }

  async function handleSelectUser(person) {
    const response = await createConversations({
      participant_id: person.id,
      created_by: user.id,
    });

    const conversationID = response.conversation_id || response.id;

    const convos = await getConversations(user.id);
    setContacts(convos.data);
    setSelected(conversationID);
    setSearchQuery("");
    setSearchResults([]);
  }

  return (
    <>
      <div
        className="relative bg-cover bg-center bg-no-repeat h-screen font-mono flex flex-wrap items-center w-full overflow-hidden"
        style={{ backgroundImage: `url(${BackImage})` }}
      >
        {/* 
          // *This is the Menu box for additional settings
        */}
        {showMenu && (
          <div className="absolute bg-gray-800 text-white shadow-2xl shadow-teal-500 rounded-2xl top-15 left-6">
            <ol className="flex flex-col">
              <li className="hover:bg-gray-500 hover:text-black p-3 rounded-2xl cursor-pointer flex justify-between">
                <p>Settings</p>
                <Settings />
              </li>
              <li className="hover:bg-gray-500 hover:text-black p-3 rounded-2xl cursor-pointer flex justify-between items-center gap-3">
                <p>Theme</p>
                <div className="flex rounded-2xl gap-3">
                  <button className="cursor-pointer">
                    <Sun />
                  </button>
                  <button className="cursor-pointer">
                    <Moon />
                  </button>
                </div>
              </li>
              <button onClick={logout}>
                <li className="hover:bg-gray-500 hover:text-black p-3 rounded-2xl flex justify-between  cursor-pointer">
                  <p>Logout</p> <LogOut className="size-5" />{" "}
                </li>
              </button>
            </ol>
          </div>
        )}
        {/* 
          // *THIS IS THE CONTACT'S LIST SECTION
        */}
        <div className="w-90 md:w-90 shrink-0 max-md:w-90 h-screen rounded-lg bg-BackColor px-4 overflow-hidden">
          <aside className="h-full">
            <div className="flex flex-wrap justify-around pt-5">
              <button
                onClick={toggleMenu}
                className="p-2 cursor-pointer rounded-2xl hover:bg-mauve-500"
              >
                <Menu />
              </button>

              <div ref={searchRef} className="relative">
                <form
                  className="flex items-center gap-5 shrink-0 rounded-2xl border border-black"
                  onSubmit={handleSearch}
                >
                  <Search className="size-6 ml-3" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="p-2 w-full outline-none"
                    placeholder="username"
                    required
                  />
                </form>
                {searchResults.length > 0 && (
                  <div className="absolute top-full left-0 w-full z-50 bg-List shadow-md shadow-black rounded-lg max-h-60 overflow-y-auto">
                    {searchResults.map((person) => (
                      <div
                        key={person.id}
                        onClick={() => handleSelectUser(person)}
                        className="p-3 hover:bg-gray-400 cursor-pointer"
                      >
                        <p>{person.username}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <hr className="my-5 shrink-0" />
            <section className="overflow-y-auto">
              {!contacts ? (
                <p className="flex flex-1 items-center justify-center text-2xl mt-10">
                  Serch it - Click it - And go...
                </p>
              ) : (
                contacts.map((conversation) => (
                  <div
                    key={conversation.id}
                    className="hover:bg-gray-100 rounded-2xl"
                  >
                    <ContactCard
                      conversation={conversation}
                      currentUserId={user.id}
                      onSelect={() => setSelected(conversation.id)}
                    />
                  </div>
                ))
              )}
            </section>
          </aside>
        </div>

        {/* 
          // **THIS IS THE CHAT SECTION
        */}

        <div className="flex-1 min-w-0 h-screen max-sm:hidden">
          {!selected ? (
            <div className="flex items-center justify-center h-screen ">
              <p className="p-5 bg-BackColor font-extrabold text-3xl shadow-2xl shadow-emerald-600 rounded-2xl">
                Gossip Time.
              </p>
            </div>
          ) : (
            <div className=" w-full p-5 rounded-lg h-full flex flex-wrap justify-between items-center flex-col">
              {/* The profile details */}
              <header className="w-full flex justify-center flex-wrap">
                {/* User Name and Status Section */}
                <div className="bg-BackColor flex items-center p-3 gap-5 rounded-2xl">
                  <UserIcon className="size-8" />
                  <div className="flex items-center justify-around gap-30">
                    <div>
                      <p className="text-lg">
                        {
                          contacts.find(
                            (conversation) =>
                              String(conversation.id) === String(selected),
                          )?.participants[0]?.username
                        }
                      </p>
                      <p className="text-sm">Online</p>
                    </div>
                    <button className="p-2 rounded-2xl cursor-pointer hover:bg-mauve-500">
                      <EllipsisVertical />
                    </button>
                  </div>
                </div>
              </header>
              {/* The Chat Section */}
              <main className="flex-1 w-full overflow-y-auto p-4 flex flex-col gap-3">
                {messages.map((message) => {
                  const isMine = String(message.sender_id) === String(user.id);
                  return (
                    <div
                      key={message.id}
                      className={`max-w-[70%] p-3 rounded-2xl ${isMine ? "self-end bg-blue-400" : "self-start bg-white"}`}
                    >
                      <p>{message.content}</p>
                    </div>
                  );
                })}
              </main>
              {/* The input box */}
              <footer className="w-full max-w-[70%]">
                <form
                  onSubmit={handleMessage}
                  className="flex items-center rounded-2xl bg-BackColor"
                >
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="p-3 rounded-md w-full outline-none"
                    placeholder="Type message..."
                    required
                  />

                  <button
                    type="submit"
                    className="rounded-2xl cursor-pointer hover:bg-gray-600 p-3"
                  >
                    <Send />
                  </button>
                </form>
              </footer>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
