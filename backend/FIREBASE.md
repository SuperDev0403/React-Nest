# Firebase

### Requirements

 - create a Firebase project with
   - Firebase Storage

 - enable [Identity and Access Management API](https://console.developers.google.com/apis/api/iam.googleapis.com/overview)
 - set up Service Account
   - download service account key
 - set up Service Account [permissions](https://console.developers.google.com/iam-admin/iam)
   - add role "Service Account Token Creator" to "App Engine default service account" and
     "Google APIs Service Agent"

 - install [Google Cloud SDK](https://cloud.google.com/sdk)

### Initial setup

1. Log in to gcloud
   ```
   gcloud init
   ```

2. Setup CORS for storage (replace `<bucket-name>` with concrete bucket name)
   ```
   gsutil cors set ./storage.cors.json gs://<bucket-name>
   ```
