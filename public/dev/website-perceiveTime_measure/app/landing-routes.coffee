# Routes for landing pages.
#
# How to add custom meta tags:
#
#  add them under the route with key `meta`.
#  example:
#
#     ```
#      'best-free-time-tracking-app-for-iphone':
#        title: 'Best free time tracking app for iphone'
#        template: 'iphone'
#        meta: [{
#          name: 'TEST'
#          content: 'TEST-CONTENT'
#        }]
#     ```
#
#  will add a following meta tag for the page:
#  `<meta name="TEST" content="TEST-CONTENT">`
#
#  The keys for the meta tags can be custom, so if you wanted to create a meta
#  tag for some OG image it would look like this:
# ```
#   meta: [{
#     property: 'og:image'
#     content: 'https://media0.giphy.com/media/jA8TT03Sj2pXO/200_s.gif'
#   }]
# ```
#

module.exports =
  'best-free-time-tracking-app-for-iphone':
    title: 'Best free time tracking app for iphone'
    template: 'iphone'
    meta: [{
      name: 'description'
      content: 'Analyize your time usage by tracking daily activites on your iPhone. All the data is synced to the cloud and can be exported as online timesheet.'
      },{
      property: 'og:image'
      content: 'https://toggl.com/photos/toggl-iphone-timesheet.jpg'
    }]

  'best-free-time-tracking-app-for-android':
    title: 'Best free time tracking app for android'
    template: 'android'
    meta: [{
      name: 'description'
      content: 'Analyize your time usage by tracking daily activites on your Android phone. All the data is synced to the cloud and can be exported as online timesheet.'
      },{
      property: 'og:image'
      content: 'https://toggl.com/images/share-img/fb-share-img.jpg'
    }]

  'trello-time-tracking':
    title: 'Time tracking integration with Trello'
    template: 'trello'
    meta: [{
      name: 'description'
      content: 'Track time spent on Trello tasks and export timesheets in Toggl. Managing work time with this simple Chrome extension is really quick and easy.'
      },{
      property: 'og:image'
      content: 'https://toggl.com/images/share-img/fb-share-img.jpg'
    }]

  'work-management-software':
    title: 'Toggl - Free Work Management Software'
    template: 'work-management'
    meta: [{
      name: 'description'
      content: 'Set up projects and track them in real time. Then analyze your work time profitability and productivity with the help of different Toggl reports, graphs and dashboards.'
      },{
      property: 'og:image'
      content: 'https://toggl.com/images/share-img/fb-share-img.jpg'
    }]

  'project-time-management':
    title: 'Toggl - Free Project Time Management Software'
    template: 'project-management'
    meta: [{
      name: 'description'
      content: 'Analyize project time usage by tracking daily activites with the whole team. All the data is synced to the cloud and can be exported as online timesheet or viewed on different dashboards.'
      },{
      property: 'og:image'
      content: 'https://toggl.com/images/share-img/fb-share-img.jpg'
    }]

  'employee-time-management':
    title: 'Toggl - Online Employee Time Management Software'
    template: 'employee-management'
    meta: [{
      name: 'description'
      content: 'Analyize the time usage of your employees. Very simple setup and easy real time tracking. All the data is synced to the cloud and can be exported as online timesheets.'
      },{
      property: 'og:image'
      content: 'https://toggl.com/images/share-img/fb-share-img.jpg'
    }]

  'google-calendar-timer-integration':
    title: 'Best time tracking integration with Google Calendar'
    template: 'google-calendar'
    meta: [{
      name: 'description'
      content: 'Directly track time spent on calendar events and export timesheets from Toggl. Managing work time with Google Calendar and Toggl is really quick and easy with this simple Chrome extension.'
      },{
      property: 'og:image'
      content: 'https://toggl.com/images/share-img/fb-share-img.jpg'
    }]

  'online-timesheet-software':
    title: 'Toggl - Online Timesheet Software'
    template: 'online-timesheet'
    meta: [{
      name: 'description'
      content: 'Analyize the time usage of your employees. Use timer or add time logs manually. All the data is synced to the cloud and generated into useful time reports and graphs.'
      },{
      property: 'og:image'
      content: 'https://toggl.com/images/share-img/fb-share-img.jpg'
    }]

  'work-time-measuring-web-app':
    title: 'Toggl - Free Work Time Measuring Web App'
    template: 'work-measuring'
    meta: [{
      name: 'description'
      content: 'Analyize work time usage by tracking daily activites. All the data is synced to the cloud and can be exported as online timesheet or viewed on different dashboards.'
      },{
      property: 'og:image'
      content: 'https://toggl.com/images/share-img/fb-share-img.jpg'
    }]

  'customer-profitability-analysis-software':
    title: 'Toggl - Customer Profitability Analysis Software'
    template: 'customer-profitability'
    meta: [{
      name: 'description'
      content: 'Analyize your project time usage by tracking daily tasks and see how much time each customer takes out of your day. All the data is synced to the cloud and can be exported as online timesheet or viewed on different dashboards.'
      },{
      property: 'og:image'
      content: 'https://toggl.com/images/share-img/fb-share-img.jpg'
    }]

  'best-time-keeping-software-lawyers':
    title: 'Toggl - Best Time Tracking Software For Lawyers'
    template: 'lawyers'
    meta: [{
      name: 'description'
      content: 'Track time spent on client tasks, calls, meetings and e-mails. Automatic rounding option, different billable rates and powerful reports make it the best time tracking software for lawyers and attorneys.'
      },{
      property: 'og:image'
      content: 'https://toggl.com/images/share-img/fb-share-img.jpg'
    }]

  'best-time-reporting-software-freelancers':
    title: 'Toggl - Best Free Time Tracking Software For Freelancers'
    template: 'freelancers'
    meta: [{
      name: 'description'
      content: 'Track time spent on client tasks, calls, meetings and e-mails. Different billable rates and reports sharing make it the best time tracking software for freelancers.'
      },{
      property: 'og:image'
      content: 'https://toggl.com/images/share-img/fb-share-img.jpg'
    }]

  'corporate-timesheet-alternative-application':
    title: 'Toggl - The Best Timesheets Alternative System'
    template: 'timesheet-alternative'
    meta: [{
      name: 'description'
      content: 'Track and analyize your work hours in real time. Use the online timer with the whole team and all the data is synced to the cloud. Toggl is the best timesheets alternative.'
      },{
      property: 'og:image'
      content: 'https://toggl.com/images/share-img/fb-share-img.jpg'
    }]

  'work-hours-tracking':
    title: 'Toggl - Free Web App For Tracking Work Hours'
    template: 'hours-tracking'
    meta: [{
      name: 'description'
      content: 'Analyize work time usage by tracking daily activites. All the data is synced to the cloud and can be exported as online timesheet or viewed on different dashboards.'
      },{
      property: 'og:image'
      content: 'https://toggl.com/images/share-img/fb-share-img.jpg'
    }]

  'task-duration-tracking-tool':
    title: 'Toggl - Free Online Task Tracking Tool'
    template: 'task-tracking'
    meta: [{
      name: 'description'
      content: 'Analyize task time usage by tracking daily activites on the web and with Android or iPhone app. All the data is synced to the cloud and can be exported as online timesheet or viewed on different dashboards.'
      },{
      property: 'og:image'
      content: 'https://toggl.com/images/share-img/fb-share-img.jpg'
    }]

  'company-productivity-analysis-web-app':
    title: 'Toggl - Employee Productivity Tracker'
    template: 'company-productivity'
    meta: [{
      name: 'description'
      content: 'Analyize the time usage and productivity of your employees. Simple online timer and great visual reports. All the data is synced to the cloud and can be exported as online timesheets.'
      },{
      property: 'og:image'
      content: 'https://toggl.com/images/share-img/fb-share-img.jpg'
    }]

  'best-time-tracking-software-windows':
    title: 'Toggl - Free Time Tracking Software For Windows'
    template: 'windows'
    meta: [{
      name: 'description'
      content: 'Analyize work time usage by tracking daily activites. All the data is synced to the cloud and can be exported as online timesheet or viewed on different dashboards in the web version.'
      },{
      property: 'og:image'
      content: 'https://toggl.com/images/share-img/fb-share-img.jpg'
    }]

  'daily-battles':
    title: 'Toggl - We battle daily'
    template: 'daily-battles'
    meta: [{
      name: 'description'
      content: 'Victory shall be ours'
      },{
      property: 'og:image'
      content: 'https://toggl.com/images/share-img/fb-share-img.jpg'
    }]

  'best-productivity-tools-2016':
    title: 'Best Productivity Tools and Apps in 2016'
    template: 'best-productivity-tools-2016'
    meta: [{
      name: 'description'
      content: 'Comprehensive overview of the best free online productivity tools and apps to use in 2016. Most of these are cloud based.'
      },{
      property: 'og:image'
      content: 'https://toggl.com/images/share-img/fb-share-img.jpg'
    }]

  'motivate-employee-time-tracking':
    title: 'How to Motivate Employees to Track Time and Improve Productivity'
    template: 'motivate-employee-time-tracking'
    meta: [{
      name: 'description'
      content: 'Are you having difficulty getting your employees to track their work hours and productivity? Here\'s a guide on how to motivate them to fill in their timesheets.'
      },{
      property: 'og:image'
      content: 'https://toggl.com/images/share-img/fb-share-img.jpg'
    }]

  'google-calendar-timer':
    title: 'Google Calendar Time Tracking Chrome Extension'
    template: 'google-calendar-timer'
    meta: [{
      name: 'description'
      content: 'Quick step-by-step guide on setting up the Google Calendar - Toggl time tracker integration with the help of Toggl Button extension.'
      },{
      property: 'og:image'
      content: 'https://toggl.com/images/share-img/fb-share-img.jpg'
    }]

  'salesforce-time-tracking':
    title: 'Time tracking integration with Salesforce'
    template: 'salesforce'
    meta: [{
      name: 'description'
      content: 'Track time spent on Salesforce tasks and export timesheets in Toggl. Managing work time with this simple Chrome extension is really quick and easy.'
      },{
      property: 'og:image'
      content: 'https://toggl.com/images/share-img/fb-share-img.jpg'
    }]

  'part-time-employee-definition-us':
    title: 'Definition of a part-time employee in the US'
    template: 'part-time-employee-definition-us'
    meta: [{
      name: 'description'
      content: 'Under federal law there is no practical difference between a part-time and a full-time employee. Use this guide to understand obligations that come with hiring a part-time employee.'
      },{
      property: 'og:image'
      content: 'https://toggl.com/images/share-img/fb-share-img.jpg'
    }]

  'asana-time-tracking':
    title: 'Time tracking integration with Asana'
    template: 'asana'
    meta: [{
      name: 'description'
      content: 'Track time spent on Asana tasks and export timesheets in Toggl. Just get the free Chrome timer extension and start tracking your productivity.'
      },{
      property: 'og:image'
      content: 'https://toggl.com/images/share-img/fb-share-img.jpg'
    }]

  'reporting-timesheet-data':
    title: 'How to turn your office team timesheets into powerful reports'
    template: 'reporting-timesheet-data'
    meta: [{
      name: 'description'
      content: 'Data is only valuable when you know how to use it. Here\'s a guide into turning your office team timesheet information into actionable insight.'
      },{
      property: 'og:image'
      content: 'https://toggl.com/images/share-img/fb-share-img.jpg'
    }]

  'todoist-time-tracking':
    title: 'Time tracking integration with Todoist'
    template: 'todoist'
    meta: [{
      name: 'description'
      content: 'Track time spent on your Todoist list items and export the logs directly to Toggl. Managing time spent on your to-do list with this simple Chrome extension is really quick and easy.'
      },{
      property: 'og:image'
      content: 'https://toggl.com/images/share-img/fb-share-img.jpg'
    }]

  'wunderlist-time-tracking':
    title: 'Time tracking integration for Wunderlist in Chrome'
    template: 'wunderlist'
    meta: [{
      name: 'description'
      content: 'Get an online work timer into your Wunderlist account. Track time spent on Wunderlist tasks and export timesheets in Toggl. Managing work time with this simple Chrome extension is really quick and easy.'
      },{
      property: 'og:image'
      content: 'https://toggl.com/images/share-img/fb-share-img.jpg'
    }]

  'jira-time-tracking':
    title: 'JIRA time tracking integration with Toggl'
    template: 'jira'
    meta: [{
      name: 'description'
      content: 'Integrate time tracking into JIRA with this simple Chrome timer extension. The Chrome plugin is free and puts a light-weight online timer into JIRA.'
      },{
      property: 'og:image'
      content: 'https://toggl.com/images/share-img/fb-share-img.jpg'
    }]

  'project-collaboration-with-timesheets':
    title: 'How to improve project collaboration with timesheets'
    template: 'project-collaboration-with-timesheets'
    meta: [{
      name: 'description'
      content: 'If you want to make sure your team is organised and efficient when working on collaborative efforts, you absolutely need to monitor how they\'re using their time.'
      },{
      property: 'og:image'
      content: 'https://toggl.com/images/share-img/fb-share-img.jpg'
    }]

  'gmail-time-tracking':
    title: 'Time tracking integration with Google Mail'
    template: 'gmail-time-tracking'
    meta: [{
      name: 'description'
      content: 'Track the time you spend on your emails right from inside your Gmail inbox. With this Toggl-Gmail integration it is free, quick and easy.'
      },{
      property: 'og:image'
      content: 'https://toggl.com/images/share-img/fb-share-img.jpg'
    }]

  'toodledo-time-tracking':
    title: 'Time tracking integration with Toodledo'
    template: 'toodledo-time-tracking'
    meta: [{
      name: 'description'
      content: 'Track the time you spend on your Toodledo tasks without switching apps. Managing time spent on your list with this simple Chrome extension is quick and simple.'
      },{
      property: 'og:image'
      content: 'https://toggl.com/images/share-img/fb-share-img.jpg'
    }]

  'how-to-create-simple-excel-timesheet':
    title: 'How to create a simple Excel timesheet for your employees'
    template: 'how-to-create-simple-excel-timesheet'
    meta: [{
      name: 'description'
      content: 'This is a tutorial on how to create a simple Excel timesheet with protected formulas that you can easily share with your employees.'
      },{
      property: 'og:image'
      content: 'https://toggl.com/images/share-img/fb-share-img.jpg'
    }]

  'pomodoro-timer-toggl':
    title: 'Pomodoro timer integration for Toggl'
    template: 'pomodoro-time-tracking'
    meta: [{
      name: 'description'
      content: 'With the Toggl Button Chrome extension, you can integrate your Pomodoro technique with the powerful Toggl time tracking tool!'
      },{
      property: 'og:image'
      content: 'https://toggl.com/images/share-img/fb-share-img.jpg'
    }]

  'how-to-calculate-billable-hours':
    title: 'How to calculate your billable hours with Toggl'
    template: 'how-to-calculate-billable-hours'
    meta: [{
      name: 'description'
      content: 'Calculating billable hours can be time consuming, especially if you need to factor in different rates. With Toggl, this process can be easily automated.'
      },{
      property: 'og:image'
      content: 'https://toggl.com/images/share-img/fb-share-img.jpg'
    }]

  'media-coverage':
    title: 'Toggl - Media coverage and Press Mentions'
    template: 'media-coverage'
    meta: [{
      name: 'description'
      content: 'Toggl time management system has been mentioned in all the biggest media outlets along with top productivity blogs.'
      },{
      property: 'og:image'
      content: 'https://toggl.com/images/share-img/fb-share-img.jpg'
    }]

  'time-reports':
    title: 'Toggl Reports - Visual Timesheet Data & Sharing'
    template: 'reports'
    meta: [{
      name: 'description'
      content: 'Get actionable insights about your employee time management. Filter reports, share the view-only access to clients or export it all to Excel.'
      },{
      property: 'og:image'
      content: 'https://toggl.com/images/share-img/fb-share-img.jpg'
    }]

  'best-software-development-management-tools-2016':
    title: 'Best Productivity Tools for Software Development Teams in 2016'
    template: 'best-software-development-management-tools-2016'
    meta: [{
      name: 'description'
      content: 'Are you using the right productivity tools with your agile team setup? Here is a list of killer software development management tools you cannot miss going into 2016.'
      },{
      property: 'og:image'
      content: 'https://toggl.com/images/share-img/fb-share-img.jpg'
    }]

  'best-airport-tips':
    title: 'Awesome airport hacks to make flying suck less'
    template: 'best-airport-tips'
    meta: [{
      name: 'description'
      content: 'Airports can be a real time sink, especially if you\'re travelling for work. Here are our top tricks for making the flying experience a lot easier and faster.'
      },{
      property: 'og:image'
      content: 'https://toggl.com/images/share-img/fb-share-airport-tips.jpg'
    }]

  'kanban-time-tracking':
    title: 'Kanban Time - How to Account for Time in Agile Project Development'
    template: 'kanban-time-tracking'
    meta: [{
      name: 'description'
      content: 'Ever broke your budget because the client just kept coming back with that "one more thing"? This is why even agile teams need to track their time.'
      },{
      property: 'og:image'
      content: 'https://toggl.com/images/share-img/fb-share-kanban-time-tracking.jpg'
    }]

  '20-best-tools-for-digital-nomads':
    title: '20 Best Tools for Digital Nomads in 2016'
    template: 'best-digital-nomad-tools-2016'
    meta: [{
      name: 'description'
      content: 'What are the hottest tools for digital nomads and remote workers in 2016? This infographic will bring you up to speed with the latest and the greatest.'
      },{
      property: 'og:image'
      content: 'https://toggl.com/images/share-img/fb-share-digital-nomad-tools.jpg'
    }]

  'pivotal-tracker-time-tracking':
    title: 'Time tracking integration with Pivotal Tracker'
    template: 'pivotal-tracker-time-tracking'
    meta: [{
      name: 'description'
      content: 'Track the time you spend on your Pivotal Tracker tickets without switching apps. Managing time spent on your list with this Chrome extension is quick and simple.'
      },{
      property: 'og:image'
      content: 'https://toggl.com/images/share-img/fb-share-img.jpg'
    }]

  'office-productivity-tips':
    title: 'The Story of Frank - A Visual Guide to a Shorter Workday (Infographic)'
    template: 'office-productivity-tips'
    meta: [{
      name: 'description'
      content: 'Follow Frank, our imaginary office guinea pig, as we give tips on how to finish your work quicker (no Franks were harmed in the making of this infographic).'
      },{
      property: 'og:image'
      content: 'https://toggl.com/images/share-img/fb-share-office-productivity-tips.jpg'
    }]

  'zendesk-timer-toggl':
    title: 'Zendesk timer integration for Toggl'
    template: 'zendesk'
    meta: [{
      name: 'description'
      content: 'Track the time that you spend working inside Zendesk. This simple Chrome extension integrates Toggl time tracking with Zendesk.'
      },{
      property: 'og:image'
      content: 'https://toggl.com/images/share-img/fb-share-img.jpg'
    }]

  'scheduled-timesheet-reports':
    title: 'Sharing your timesheet data with Toggl Pro Plus'
    template: 'scheduled-timesheet-reports'
    meta: [{
      name: 'description'
      content: 'Data is king - those who know how to use it best will rule the business world. Learn how to easily share your time tracking records with Toggl Pro Plus.'
      },{
      property: 'og:image'
      content: 'https://toggl.com/images/share-img/fb-share-img.jpg'
    }]

  'toggl-developer-challenge':
    title: 'The Epic Toggl Timer Developer Challenge 2016'
    template: 'toggl-developer-challenge'
    meta: [{
      name: 'description'
      content: 'Put our timer inside your favourite app, win iPad, swag & eternal glory!'
      },{
      property: 'og:image'
      content: 'https://toggl.com/images/share-img/fb-share-developer-challenge.jpg'
    }]

  'developer-methods-infographic':
    title: 'Software Development Methods Explained With Cars (Infographic)'
    template: 'developer-methods-infographic'
    meta: [{
      name: 'description'
      content: 'An epic visual guide into how software development agencies work, and what kind of problems they face daily.'
      },{
      property: 'og:image'
      content: 'https://toggl.com/images/share-img/fb-share-developer-methods-infographic.jpg'
    }]

  'agile-development-best-tools':
    title: 'Using cloud tools in agile development'
    template: 'agile-development-best-tools'
    meta: [{
      name: 'description'
      content: 'Cloud based B2B tools are the future - here\'s how to use Toggl, Trello & GitHub to manage agile development projects.'
      },{
      property: 'og:image'
      content: 'https://toggl.com/images/share-img/fb-share-img.jpg'
    }]

  'timesheet-reminders':
    title: 'Setting timesheet reminders with Toggl Pro Plus'
    template: 'timesheet-reminders'
    meta: [{
      name: 'description'
      content: 'Timesheets can give you tons of valuable business intelligence - but only if your team remembers to fill in their hours. Toggl can help them with this.'
      },{
      property: 'og:image'
      content: 'https://toggl.com/images/share-img/fb-share-img.jpg'
    }]

  'locking-timesheets':
    title: 'Locking your timesheets with Toggl Pro Plus'
    template: 'locking-timesheets'
    meta: [{
      name: 'description'
      content: 'With Toggl Pro Plus you can now lock your employees\' timesheets to make sure your data doesn\'t accidentally get changed after you\'ve sent out your reports.'
      },{
      property: 'og:image'
      content: 'https://toggl.com/images/share-img/fb-share-img.jpg'
    }]

  'worst-client-types-infographic':
    title: 'Terrible clients explained with pirates (infographic)'
    template: 'worst-client-types-infographic'
    meta: [{
      name: 'description'
      content: 'When it comes to wasting your time, these clients are the worst offenders. See what sneaky tactics they use, and how you can defend your business and time.'
      },{
      property: 'og:image'
      content: 'https://toggl.com/images/share-img/fb-share-terrible-clients.jpg'
    }]
