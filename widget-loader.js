class FindorWidget {
  constructor(CharURL) {
    const parts = CharURL.split('/')

    this.open = false;
    this.CharURL = CharURL
    this.id_char = parts.pop()
    this.fingerPrint = ""
    this.domain = window.location.hostname
    this.validateDomain()
  }

  async validateDomain() {
    const fingerPrint = await this.take_fingerprint()

    console.log(`Dominio: ${this.domain}`)
    const res = await fetch(`http://localhost:5000/validate_domain?id_char=${this.id_char}&domain=${this.domain}`)
    const data = await res.json()
    const validDomain = data['valid_domain']
    console.log(`valid domain: ${validDomain}`)

    if (validDomain) {
      let token = localStorage.getItem("user_tkn")

      if (!token) {
        token = await this.generateNewToken(fingerPrint)
        localStorage.setItem("user_tkn", token)
      }

      this.initialise(token, fingerPrint);
      this.createStyles();

    }
  }

  async generateNewToken(fingerPrint) {
    this.fingerPrint = fingerPrint
    const res = await fetch(`http://localhost:5000/new_token?fprint=${fingerPrint}&id_char=${this.id_char}`, {
      method: 'POST'
    })
    const data = await res.json()
    console.log(data)
    return data['user_tkn']
  }

  async take_fingerprint() {
    const FingerprintJS = await import('https://openfpcdn.io/fingerprintjs/v4');
    const fp = await FingerprintJS.load();
    const result = await fp.get();
    return result.visitorId;

  }

  initialise(token, fingerPrint) {
    const container = document.createElement("div");
    container.style.position = "fixed";
    container.style.bottom = "30px";
    container.style.right = "30px";
    container.style.display = "flex";
    container.style.justifyContent = "end";
    document.body.appendChild(container);

    const buttonContainer = document.createElement("div");
    buttonContainer.classList.add("button-container");

    const chatIcon = document.createElement("i");
    chatIcon.classList.add("icon", "fa-regular", "fa-message", "fa-xl");
    this.chatIcon = chatIcon;

    buttonContainer.appendChild(this.chatIcon);
    buttonContainer.addEventListener("click", this.toggleOpen.bind(this));

    this.messageContainer = document.createElement("iframe");
    this.messageContainer.src = `${this.CharURL}?tkn=${token}&fprint=${fingerPrint}`
    this.messageContainer.style.border = 0
    this.messageContainer.classList.add("hidden", "message-container");

    container.appendChild(this.messageContainer);
    container.appendChild(buttonContainer);
  }

  createStyles() {
    const styleTag = document.createElement("style");
    styleTag.innerHTML = `
        .icon {
            cursor: pointer;
            top: 9px;
            left: 9px;
            transition: transform .3s ease;
            text-align: center;
            color: #ffffff;

        }
        .hidden {
            transform: scale(0);
        }
        .button-container {
            background-color: #5f249f;
            width: 60px;
            height: 60px;
            border-radius: 50%;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        .message-container {
            box-shadow: 0 0 18px 8px rgba(0, 0, 0, 0.1), 0 0 32px 32px rgba(0, 0, 0, 0.08);
            width: 400px;
            height: 500px;
            right: -25px;
            bottom: 80px;
            border-radius: 8px;
            position: absolute;
            max-height: 500px;
            transition: max-height .2s ease;
            font-family: Helvetica, Arial ,sans-serif;
            overflow-y: none;
            overflow-x: none;
            margin-right: 40px;
        }
        .message-container.hidden {
            max-height: 0px;
        }

        input[type="text"] {
          font-size:20px;
        }
    `.replace(/^\s+|\n/gm, "");
    document.head.appendChild(styleTag);
  }

  toggleOpen() {
    this.open = !this.open;
    if (this.open) {
      this.chatIcon.classList.add("far", "fa-window-close");
      this.chatIcon.classList.remove("fa-regular", "fa-message");
      this.messageContainer.classList.remove("hidden");
    } else {
      this.chatIcon.classList.remove("far", "fa-window-close");
      this.chatIcon.classList.add("fa-regular", "fa-message");
      this.messageContainer.classList.add("hidden");
    }
  }
}


function initChatWidget(CharURL) {
  new FindorWidget(CharURL);
}
initChatWidget(Findor.CharURL);
