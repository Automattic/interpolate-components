const TOKEN_TYPES = [ 'componentClose', 'componentSelfClosing', 'componentOpen' ];

function identifyToken( item, regExps ) {
	for ( let i = 0; i < TOKEN_TYPES.length; i++ ) {
		const type = TOKEN_TYPES[ i ];
		const match = item.match( regExps[ type ] );

        if ( match ) {
			return {
				type: type,
				value: match[ 1 ]
			};
		}
	}

	return {
		type: 'string',
		value: item
	};
}

/**
 * @param {string} str
 * @returns {string}
 */
function escapeRegExp( str ) {
    return str.replace( /[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&' );
}

/**
 * @param {string[]} tag
 * @param {boolean} match
 * @returns {RegExp}
 */
function makeRegExp( tag, match ) {
	const [ start, end ] = tag;
	const inner = match ? '\\s*(\\w+)\\s*' : '\\s*\\w+\\s*';
	return new RegExp( `${escapeRegExp( start )}${inner}${escapeRegExp( end )}` );
}

module.exports = function( mixedString, tags ) {
	// create regular expression that matches all components
	const combinedRegExpString = TOKEN_TYPES
		.map( type => tags[ type ] )
		.map( tag => makeRegExp( tag, false ).source )
		.join( '|' );
	const combinedRegExp = new RegExp( `(${combinedRegExpString})`, 'g' );

    // split to components and strings
	const tokenStrings = mixedString.split( combinedRegExp );

	// create regular expressions for identifying tokens
    const componentRegExps = {};
    TOKEN_TYPES.forEach( type => {
    	componentRegExps[ type ] = makeRegExp( tags[ type ], true );
    });

    return tokenStrings.map( (tokenString) => identifyToken( tokenString, componentRegExps ) );
};
