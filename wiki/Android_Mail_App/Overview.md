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

### Screenshots
Below are some screenshots showcasing the features of the Android Mail App:

1. **Launcher Screen**:
   ![Launcher Screen](demos/launcher.png)

2. **Sign In**:
   ![Sign In](demos/signin.png)

3. **Sign Up**:
   ![Sign Up](demos/signup.png)

4. **Inbox**:
   ![Inbox](demos/mails.png)

5. **Mail Details**:
   ![Mail Details](demos/mail_detail.png)

6. **Compose Mail**:
   ![Compose Mail](demos/compose.png)

7. **Manage Labels**:
   ![Manage Labels](demos/manage_labels.png)

8. **Label Filter**:
   ![Label Filter](demos/label_filter.png)

9. **Search Functionality**:
   ![Search](demos/search.png)

10. **Settings Panel**:
    ![Settings Panel](demos/settings_panel.png)

11. **Dark Mode**:
    ![Dark Mode](demos/dark_mode.png)

12. **Sidebar Navigation**:
    ![Sidebar Navigation](demos/sidebar.png)

13. **Action Bar Menu**:
    ![Action Bar Menu](demos/menu_actionbar.png)