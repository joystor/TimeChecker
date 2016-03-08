# Time Checker for small business

### Objective

This application, is for the need to check in the employers and report via mail when the user in to the business and go out. and get a report for how many hour work.


### Develop

The application is developed in node webkit, with database in sqlite, the code use backbone.js, require.js and underscore.js

This project was generated using yo and generator-node-webkit with the next lines

```
$ npm install -g yo generator-node-webkit

$ yo node-webkit

```

This installation require other node modules in the prefix ```app/main/```

```
$ npm install dateformat --prefix=./app/main/
$ npm install moment --prefix=./app/main/
```


### Notes

For send the mail please change in ```app/main/index.js``` a valid mail user and password in the options of ```window.MAIL_CONFIG```


### Screenshots

![alt tag](https://raw.githubusercontent.com/joystor/TimeChecker/master/screen/Screenshot%20from%202016-03-08%2010-39-00.png)

![alt tag](https://raw.githubusercontent.com/joystor/TimeChecker/master/screen/Screenshot%20from%202016-03-08%2010-39-42.png)

![alt tag](https://raw.githubusercontent.com/joystor/TimeChecker/master/screen/Screenshot%20from%202016-03-08%2010-39-55.png)

![alt tag](https://raw.githubusercontent.com/joystor/TimeChecker/master/screen/Screenshot%20from%202016-03-08%2010-40-17.png)

![alt tag](https://raw.githubusercontent.com/joystor/TimeChecker/master/screen/Screenshot%20from%202016-03-08%2010-40-36.png)
