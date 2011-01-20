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
	    defaultConfig: null,
	    contentExtractor: null,
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
	
    // Private construction
    Public.config = application.globals.get('proose.config')
    Public.extractor = application.globals.get('proose.extractor')
    Public.translate = application.globals.get('proose.translate')    
    if (!Public.config) {
        application.globals.put('proose.config', new Configuration())
        Public.config = application.globals.get('proose.config')
        Public.config.setEnableImageFetching(false)
        application.globals.put('proose.extractor', new ContentExtractor(Public.config))        
        Public.extractor = application.globals.get('proose.extractor')
        try {
            application.globals.put('proose.translate', new Translate())
            Public.translate = application.globals.get('proose.translate')
            Public.translate.setHttpReferrer(application.globals.get('proose.settings.httpReferrer'))
        } catch(error) {
            // nothing
        }
    }
    // End private construction
    
	return Public
}()

