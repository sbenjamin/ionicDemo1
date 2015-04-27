Mastering the Ionic Framework: Learn to Build & Deploy Native Speed HTML5 Based Apps
=======

Revised code example to repair 3 angularJS anti-patterns in the code bade.
This was a project I completed to learn more about the Ionic Frame.
It is an excellent Ionic framework class taught by Eric Simmons at:
https://thinkster.io/ionic-framework-tutorial/

Eric is a very progressive instructor and focused mainly on the Ionic Framework,
(This is the best ionic framework tutorial I found and I do recommend it)
But after reviewing the code, I noticed 3 angualrJS anti-patterns that were poor for performance and testing.
This is my revision of the class project to improve both.

Anti-Patterns: Direct read/write access of properties in the service layer.
Using the watch/eval-async service to call methods in a controller.
Unnecessarily exposed service property and methods in the services.
Combining service declaration with the config declaration. * Not really an anti-pattern, but not best practice.

The repair was to use setters & getters to access properties,
Converted services to the module revealing pattern, (A great pattern for testing)
and moved the constant declaration to the services.



