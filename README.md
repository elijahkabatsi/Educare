# Educare – Learning Style Discovery App

Educare is a web application that helps students identify their learning style
(Visual, Auditory, or Kinesthetic) and detects possible learning challenges
such as Dyslexia, ADHD, Dyscalculia, and Dysgraphia. Based on the results,
it recommends personalized strategies and fetches real YouTube videos tailored
to the student's learning style using the YouTube Data API v3.

## Purpose

Many students struggle in school not because they lack ability, but because
they haven't discovered how they learn best. Educare addresses this genuine
need by providing a personalized, interactive quiz that gives actionable
recommendations.

## Features

- 7-question interactive quiz with progress bar
- Detects Visual, Auditory, and Kinesthetic learning styles
- Flags possible learning challenges (Dyslexia, ADHD, Dyscalculia, Dysgraphia)
- Fetches 3 real YouTube videos tailored to the student's learning style
- Recommends specific study strategies per learning style
- Confetti animation on quiz completion
- Fully responsive design using Tailwind CSS
- Graceful error handling for API failures

## APIs Used

- **YouTube Data API v3** by Google
  - Documentation: https://developers.google.com/youtube/v3
  - Used to fetch relevant educational videos based on learning style

## How to Run Locally

1. Clone the repository:
```
   git clone https://github.com/elijahkabatsi/Educare.git
```
2. Navigate into the project folder:
```
   cd Educare
```
3. Create a `config.js` file in the root folder with your YouTube API key:
```javascript
   const CONFIG = {
       YOUTUBE_API_KEY: "your-api-key-here"
   };
```
4. Open `index.html` in your browser — no server required.

> Note: `config.js` is excluded from this repository via `.gitignore` to protect
> the API key. A valid YouTube Data API v3 key is required to load video recommendations.

## Project Structure
```
Educare/
├── index.html          # Landing page
├── questionnaire.html  # Quiz page
├── results.html        # Results + YouTube API videos
├── strategies.html     # Strategy recommendations
├── app.js              # Quiz logic and scoring
├── styles.css          # Base styles
├── config.js           # API key (excluded from repo)
└── .gitignore
```

## Deployment

The application is deployed on two web servers behind a load balancer.

- **Web01:** http://3.89.31.111
- **Web02:** http://44.202.5.108
- **Load Balancer:** http://3.91.57.45

### Deploying to Web01 and Web02

1. SSH into the server:
```
   ssh ubuntu@3.89.31.111
```
2. Install Nginx if not already installed:
```
   sudo apt update && sudo apt install nginx -y
```
3. Clone the repository:
```
   sudo git clone https://github.com/elijahkabatsi/Educare.git /var/www/html/Educare
```
4. Create the config.js file with the API key:
```
   sudo nano /var/www/html/Educare/config.js
```
   Paste:
```javascript
   const CONFIG = {
       YOUTUBE_API_KEY: "your-api-key-here"
   };
```
5. Set correct permissions:
```
   sudo chown -R www-data:www-data /var/www/html/Educare
```
6. Configure Nginx to serve the app:
```
   sudo nano /etc/nginx/sites-available/educare
```
   Paste:
```
   server {
       listen 80;
       server_name _;
       root /var/www/html/Educare;
       index index.html;
       location / {
           try_files $uri $uri/ =404;
       }
   }
```
7. Enable the site and restart Nginx:
```
   sudo ln -s /etc/nginx/sites-available/educare /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
```
8. Repeat all steps above for Web02 (IP: 44.202.5.108).

### Configuring the Load Balancer (Lb01)

1. SSH into the load balancer:
```
   ssh ubuntu@3.91.57.45
```
2. Install Nginx:
```
   sudo apt update && sudo apt install nginx -y
```
3. Configure Nginx as a load balancer:
```
   sudo nano /etc/nginx/sites-available/load_balancer
```
   Paste:
```
   upstream educare_servers {
       server 3.89.31.111;
       server 44.202.5.108;
   }

   server {
       listen 80;
       server_name _;

       location / {
           proxy_pass http://educare_servers;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
       }
   }
```
4. Enable and restart:
```
   sudo ln -s /etc/nginx/sites-available/load_balancer /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
```
5. Test by visiting http://3.91.57.45 — traffic will be distributed between
   Web01 and Web02.

## Challenges

- **API key security:** Solved by storing the key in `config.js` which is
  excluded from the repository via `.gitignore`.
- **Script load order:** The confetti library had to be loaded before `app.js`
  to avoid undefined function errors.
- **File path bug:** Fixed an incorrect `js/app.js` reference in
  `questionnaire.html` to `app.js`.

## Credits

- [YouTube Data API v3](https://developers.google.com/youtube/v3) – Google
- [Tailwind CSS](https://tailwindcss.com) – Tailwind Labs
- [Canvas Confetti](https://github.com/catdad/canvas-confetti) – catdad
- [Heroicons](https://heroicons.com) – Tailwind Labs