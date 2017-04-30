var gameTrie;
(function (gameTrie) {
    /**
     * The Trie class
     *
     * @class Trie
     */
    var Trie = (function () {
        function Trie() {
            this._root = null;
            this._root = {
                children: new Array(26),
                isWord: false
            };
        }
        /**
         * Adds a word to the trie
         *
         * @param word A word to insert.
         */
        /**
         * Insert new element to Trie
         *
         * @param word
         * @param value
         */
        Trie.prototype.insert = function (word, value) {
            var node = this._root;
            for (var i = 0; i < word.length; i++) {
                var c = word.charCodeAt(i) - 97; // 97 is the unicode for lower case 'a'
                if (!node.children[c]) {
                    node.children[c] = new TrieNode();
                }
                node = node.children[c];
            }
            node.isWord = true;
        };
        /**
         * Get
         * @param word
         * @return {TrieNode}
         */
        Trie.prototype.getNode = function (word) {
            var node = this._root;
            for (var i = 0; i < word.length; i++) {
                var c = word.charCodeAt(i) - 97;
                if (node.children[c]) {
                    node = node.children[c];
                }
                else {
                    return null;
                }
            }
            return node;
        };
        /**
         *
         * @param word
         * @return {boolean}
         */
        Trie.prototype.contains = function (word) {
            var node = this.getNode(word);
            return node ? true : false;
        };
        return Trie;
    }());
    gameTrie.Trie = Trie;
    var TrieNode = (function () {
        function TrieNode() {
            this.children = new Array(26);
            this.isWord = false;
        }
        return TrieNode;
    }());
    //export = Trie;
})(gameTrie || (gameTrie = {}));
//# sourceMappingURL=gameTrie.js.map