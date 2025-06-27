plugins {
    alias(libs.plugins.android.application)
    // אם תעבוד גם עם Kotlin-Android – בטל ההערה הבאה:
    // alias(libs.plugins.kotlin.android)
}

android {
    namespace   = "com.rakmail.androidapp"
    compileSdk  = 35

    defaultConfig {
        applicationId         = "com.rakmail.androidapp"
        minSdk                = 24
        targetSdk             = 35
        versionCode           = 1
        versionName           = "1.0"
        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
    }

    buildTypes {
        release {
            isMinifyEnabled = false
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
        }
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_11
        targetCompatibility = JavaVersion.VERSION_11
    }

    buildFeatures {
        viewBinding = true
    }
}

dependencies {

    /* --- AndroidX / UI --- */
    implementation(libs.appcompat)
    implementation(libs.material)
    implementation(libs.constraintlayout)

    /* --- Lifecycle (Java + KTX) --- */
    implementation(libs.lifecycle.viewmodel)      // Java API
    implementation(libs.lifecycle.livedata)
    implementation(libs.lifecycle.viewmodel.ktx)  // Kotlin-ext
    implementation(libs.lifecycle.livedata.ktx)

    /* --- Navigation --- */
    implementation(libs.navigation.fragment)
    implementation(libs.navigation.ui)

    /* --- Networking --- */
    implementation(libs.retrofit)
    implementation(libs.converter.gson)
    implementation(libs.okhttp)
    implementation("com.squareup.okhttp3:okhttp-urlconnection:4.12.0")   // ←- השורה הישירה

    /* --- Tests --- */
    testImplementation(libs.junit)
    androidTestImplementation(libs.ext.junit)
    androidTestImplementation(libs.espresso.core)
}
