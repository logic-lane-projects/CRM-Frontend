import { TopBar, ActionList, Frame, Badge } from "@shopify/polaris";
import { ArrowLeftIcon } from "@shopify/polaris-icons";
import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "./../../../firebase";
import { useAuthToken } from "../../hooks/useAuthToken";

import { getUnreadNumbers } from "../../services/twilio";
import { gellAllMessagesByOffice } from "../../services/twilio";
import MessagesModal from "./MessagesModal";

interface TopBarProps {
  toggleSidebar: () => void;
}

export function TopBar1({ toggleSidebar }: TopBarProps) {
  const { userInfo } = useAuthToken();
  const [isOpen, setIsOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [messages, setMessages] = useState([])
  const email = localStorage.getItem("email");
  const oficinaActual = localStorage.getItem("oficinaActual");
  const navigate = useNavigate();

  const toggleIsUserMenuOpen = useCallback(
    () => setIsUserMenuOpen((isUserMenuOpen) => !isUserMenuOpen),
    []
  );

  const handleNavigationToggle = useCallback(() => {
    toggleSidebar();
  }, [toggleSidebar]);

  const handleLogout = useCallback(async () => {
    try {
      await signOut(auth);

      localStorage.removeItem("email");
      localStorage.removeItem("accesTokenCRM");
      navigate("/");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  }, [navigate]);

  const logo = {
    topBarSource:
      "/images/CRM_1.png",
    width: 86,
    url: "/",
    accessibilityLabel: "Shopify",
  };

  function cortarEmailAntesDeArroba(email: string) {
    if (!email.includes("@")) {
      return "Correo no válido";
    }

    const parteAntesDeArroba = email.split("@")[0];
    return parteAntesDeArroba?.toUpperCase();
  }

  const getMessagesBySeller = async () => {
    try {
      const response = await getUnreadNumbers({
        user_id: await userInfo?.id || "",
        office_id: oficinaActual || "",
      });
      setMessages(response.data)
      return response;
    } catch (error) {
      console.error("Error al obtener los números no leídos:", error);
    }
  }

  const getMessagesByOffice = async () => {
    try {
      const response = await gellAllMessagesByOffice(
        oficinaActual || ""
      );
      setMessages(response.data)
      return response;
    } catch (error) {
      console.error("Error al obtener los números no leídos:", error);
    }
  }


  useEffect(() => {
    if (userInfo?.role === "administrador") {
      getMessagesByOffice()
    } else {
      getMessagesBySeller();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userInfo])

  const userMenuMarkup = (
    <TopBar.UserMenu
      actions={[
        {
          items: [
            {
              content: "Cerrar sesión",
              icon: ArrowLeftIcon,
              onAction: handleLogout,
            },
          ],
        },
      ]}
      name={cortarEmailAntesDeArroba(email || "")}
      detail={email || ""}
      initials={email?.slice(0, 2).toUpperCase()}
      open={isUserMenuOpen}
      onToggle={toggleIsUserMenuOpen}
    />
  );
  const userInfoMarkup = (
    <div className="flex items-center gap-4 justify-center w-full h-full">

      {/* Mensajes entrantes */}
      <div onClick={() => {
        setIsOpen(true)
      }} className="flex items-center cursor-pointer mr-4">
        <img className="min-w-[30px] max-w-[30px] text-white" src="images/letter.png" />
        <span className="bg-red-600 text-white rounded-full w-4 h-4 mb-5 -ml-2 flex items-center justify-center relative">
          {messages?.length ?? 0}
        </span>
      </div>

      {userInfo?.city && (
        <div className="mr-5">
          <Badge tone="info">
            {userInfo.city}
          </Badge>
        </div>

      )}
      <div className="mr-5">
        {userInfo?.role && (
          <Badge tone="success">
            {userInfo.role.toUpperCase()}
          </Badge>
        )}
      </div>

    </div>
  );


  const searchResultsMarkup = (
    <ActionList
      items={[{ content: "Cerrar sesión", onAction: handleLogout }]}
    />
  );

  const topBarMarkup = (
    <TopBar
      showNavigationToggle
      userMenu={userMenuMarkup}
      secondaryMenu={userInfoMarkup}
      searchResults={searchResultsMarkup}
      onNavigationToggle={handleNavigationToggle}
    />
  );

  return (
    <div style={{ height: "50px" }}>
      <Frame topBar={topBarMarkup} logo={logo} />
      {isOpen && <MessagesModal isOpen={isOpen} setIsOpen={setIsOpen} messages={messages as unknown as []} />}
    </div>
  );
}
