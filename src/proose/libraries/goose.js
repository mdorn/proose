importClass(com.jimplush.goose.Configuration, com.jimplush.goose.ContentExtractor)
importClass(org.apache.commons.lang.StringEscapeUtils)
try {
    importClass(com.google.api.translate.Language)
    importClass(com.google.api.translate.Translate)
} catch(error) {
    application.logger.warn("Google Translate Java API not found: Translation feature unavailable.")
}

var Goose = Goose || function() {
	var Public = {
	    config: null,
	    extractor: null,
		Extractor: function() {
    		this.extract = function(uri, srclang, tlang) {
                try {
                    // use Goose to extract article title and main text
                    var article = Public.extractor.extractContent(String(uri))
                    retval = {
                        "title": String(article.getTitle()), 
                        "text": String(StringEscapeUtils.unescapeHtml(article.getCleanedArticleText()))
                    }
                } catch(error) {
                    application.logger.info(error + ": " + uri)
                    return null
                }
                if (srclang && tlang) {
                    // use Google Translate Java API
                    var title = Public.translate.execute(retval.title, Language.fromString(srclang), Language.fromString(tlang))
                    var text = Public.translate.execute(retval.text, Language.fromString(srclang), Language.fromString(tlang))
                    retval = {
                        "title": String(title),
                        "text": String(text)
                    }
                }
                return retval
    		}
	    }
	}
	
    // Initialize config
    Public.config = application.globals.get('proose.config')
    if (!Public.config) {
        var config = new Configuration()
        config.setEnableImageFetching(false)
        Public.config = application.getGlobal('proose.config', config)
    }

    // Initialize extractor
    Public.extractor = application.globals.get('proose.extractor')
    if (!Public.extractor && Public.config) {
        Public.extractor = application.getGlobal('proose.extractor', new ContentExtractor(Public.config))
    }

    // Initialize translate (optional)
    Public.translate = application.globals.get('proose.translate')
    if (!Public.translate) {
        try {
            var translate = new Translate()
            translate.setHttpReferrer(application.globals.get('proose.settings.httpReferrer'))
            Public.translate = application.getGlobal('proose.translate', translate)
        }
        catch (x) {
            // translate is optional
        }
    }    
	return Public
}()

