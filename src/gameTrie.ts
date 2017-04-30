


module gameTrie {
/**
 * The Trie class
 *
 * @class Trie
 */
export class Trie {

    private _root:TrieNode = null;

    public constructor(){
        this._root = {
            children: new Array<TrieNode>(26),
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
    public insert(word:string, value:any):void {
        let node: TrieNode = this._root;
        for (let i = 0; i < word.length; i++) {
            let c = word.charCodeAt(i) - 97; // 97 is the unicode for lower case 'a'
            if (!node.children[c]) {
                node.children[c] = new TrieNode();
            }
            node = node.children[c];
        }
        node.isWord = true;
    }

    /**
     * Get
     * @param word
     * @return {TrieNode}
     */
    private getNode(word:string):TrieNode {
        let node = this._root;
        for (let i = 0; i < word.length; i++) {
            let c = word.charCodeAt(i) - 97;
            if (node.children[c]) {
                node = node.children[c];
            } else {
                return null;
            }
        }
        return node;
    }

    /**
     *
     * @param word
     * @return {boolean}
     */
    public contains(word:string):boolean {
        let node = this.getNode(word);
        return node ? true : false;
    }
}

class TrieNode {
    children:Array<TrieNode>;
    isWord: boolean;

    constructor() {
        this.children = new Array(26);
        this.isWord = false;
    }
}

//export = Trie;

}