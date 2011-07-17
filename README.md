[Proose](http://github.com/mdorn/proose) is a web services wrapper 
around the [Goose](http://github.com/jiminoc/goose) HTML content extracting 
library.

Proose also has limited (5,000 character maximum) support for the 
unofficial [Google Translate Java API](http://code.google.com/p/google-api-translate-java/).  

Proose is based on [Prudence](http://threecrickets.com/prudence/), the 
RESTful web platform for the JVM.  It was inspired by the need for a server-side
implementation of [Readability.js](http://code.google.com/p/arc90labs-readability/)  
Goose seems to be the best one in any language; Proose exposes it via a web services API
written primarily in a few lines of server-side JavaScript running on top of Prudence.

To use it, you'll need the JavaScript-enabled edition of Prudence.  You'll need to install the `proose` source in your instance's `applications` directory, and install or link the included jar dependencies (located in `libraries` in the repo) in the instance's `libraries` directory.  These are the dependencies:

* Goose: (http://github.com/jiminoc/goose)
* MongoDB/Rhino integration (http://code.google.com/p/mongodb-rhino/) (Note: used only for the included JSON class. Prior to version 1.1, these jars were included in Prudence, but were since moved out of it.)
* JSoup: (http://jsoup.org/packages/jsoup-1.4.1.jar)
* (Optional) Google Translate Java API: (http://code.google.com/p/google-api-translate-java/downloads/list)

Once it's up and running, it will return a JSON representation of the main text 
of the URI you give it within an HTTP POST containing your request data in JSON format:

    curl -i -H "Accept: application/json" -X POST -d '{"uri": "http://threecrickets.com/prudence/rest/"}' http://localhost:8080/proose/page/

    {
        "title": "Prudence: Scalable REST/JVM Web Development Platform",
        "text": "There's a lot of buzz about REST, but also a lot confusion about what it is and what it's good for. This essay attempts to convey REST's simple essence. Let's start, then, not at REST, but at an attempt to create a new architecture for building scalable applications. Our goals are for it to be minimal, straightforward, and still have enough features to be productive. We want to learn some lessons from the failures of other, more elaborate and complete architectures. ..."
    }

    curl -i -H "Accept: application/json" -X POST -d '{"uri": "http://threecrickets.com/prudence/legal/", "source_language": "en", "target_language": "fr"}' http://localhost:8080/proose/page/

    {
        "title": "Licence et les marques - Prudence: REST Scalable / Plate-forme de développement Web JVM - Trois grillons",
        "text": "Prudence vous est fourni sous la licence GNU Lesser General Public License version 3.0.\n\nEn outre, nous voulons mentionner expressément que les grillons Trois LLC, le titulaire du droit d'auteur que de tout le code source, n'a pas l'intention de libérer les futures versions du projet Prudence open source sous plusieurs licences restrictives, telles que la GPL. Si nous changeons la licence de nouveau dans l'avenir, il ne pouvait être pour une licence moins restrictive (comme Apache Public License).\n\nNotez que cet accord ne couvre pas les bibliothèques redistribués tiers. Les bibliothèques vous sont fournis à des fins de commodité, mais restent sous leurs licences respectives, qui sont reproduites dans les «licences / *" fichiers. Pour les demandes d'autorisation spéciales, s'il vous plaît contacter Trois grillons LLC."
    }

