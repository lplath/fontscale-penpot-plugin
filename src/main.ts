import Alpine from 'alpinejs'
import "./style.css";

import { Message, SelectionChangedMessage, ThemeChangedMessage } from "./model";

const searchParams = new URLSearchParams(window.location.search);
document.body.dataset.theme = searchParams.get("theme") ?? "light";


Alpine.store("uiVisible", false);


window.addEventListener("message", (event: MessageEvent<Message>) => {
  if (event.data.type == "themechange") {
    const message = event.data as ThemeChangedMessage;
    
    document.body.dataset.theme = message.content
  }
  else if (event.data.type == "textselected") {
    const message = event.data as SelectionChangedMessage
    // Only show the UI when one text-object is selected 
    Alpine.store("uiVisible", message.content);
  }
});


Alpine.start();