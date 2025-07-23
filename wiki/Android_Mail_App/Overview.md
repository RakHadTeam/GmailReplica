# Android Client – Mail App

This is the Android client for the APProject mail system, providing a native interface to send, receive, and manage emails.

## Features
- Login & JWT authentication
- View inbox, starred, drafts, spam
- Compose & send mails
- Create & manage labels
- Dark/Light theme support
- Responsive UI with Material Design

## How to Run
1. Install Android Studio
2. Clone the project
3. Open `src/AndroidApp` in Android Studio & sync Gradle
4. Run on emulator or device
5. Ensure backend & blacklist server are running (see [Full Stack Mail App](../FullStack_Mail_App/Overview.md))

## Project Structure
com.rakmail.androidapp/<br>
├ ── core/<br>
│   ├── api/         # Network client & API logic<br>
│   ├── auth/        # Authentication logic & interceptors<br>
│   ├── prefs/       # Shared preferences (auth, user)<br>
│   └── util/        # Utilities and helpers<br>
├ ── features/<br>
│   ├── compose/     # Compose mail screen<br>
│   ├── inbox/       # Inbox screen<br>
│   ├── label/       # Label management<br>
│   ├── launcher.ui/ # Launcher screen & navigation<br>
│   ├── mail/        # General mail logic<br>
│   ├── maildetail/  # Mail detail screen<br>
│   ├── search/      # Search functionality<br>
│   ├── settings/    # Settings screen<br>
│   └── user/        # User profile & view models<br>
└ ── App              # Application class<br>

### 🔗 Technologies
- Android (Kotlin/Java)
- MVVM pattern
- Retrofit / OkHttp (likely, via `api`)
- SharedPreferences

## Demos
- Screenshots of the app in action, showcasing the main features like inbox, compose screen, and settings in the `wiki/Android_Mail_App/demos` directory.