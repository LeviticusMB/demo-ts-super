class URI extends URL {
    override readonly href!: string;
    override readonly origin!: string;
    override readonly protocol!: string;
    override readonly username!: '';
    override readonly password!: '';

    constructor(url: string | URL, base?: string | URL) {
        super(url, base);
        this.username = this.password = '';

        Object.defineProperty(this, 'href',     { get: () => super.href     });
        Object.defineProperty(this, 'origin',   { get: () => super.origin   });
        Object.defineProperty(this, 'protocol', { get: () => super.protocol });
        Object.defineProperty(this, 'username', { get: () => super.username });
        Object.defineProperty(this, 'password', { get: () => super.password });
    }

    set _href(href: string) {
        // @ts-ignore Why is this an error?
        super.href = href;
    }
}

function guard(fn: () => void) {
    try {
        fn();
    } catch (e) {
        console.warn(`${fn} threw ${e}`);
    }
}

console.assert(false, 'console.assert works!')

// Username/password will be removed
const uri = new URI('https://foo:bar@example.com?query#hash');
console.log(uri.toString());
console.assert(uri.href === 'https://example.com/?query#hash', uri.href);
console.assert(uri.username === '', uri.username);
console.assert(uri.password === '', uri.password);

// Read-only properties
// @ts-expect-error readonly
guard(() => uri.username = 'user');
// @ts-expect-error readonly
guard(() => uri.password = 'pass');
// @ts-expect-error readonly
guard(() => uri.protocol = 'ftp:');
console.log(uri.toString());
console.assert(uri.href === 'https://example.com/?query#hash', uri.href);
console.assert(uri.username === '', uri.username);
console.assert(uri.password === '', uri.password);
console.assert(uri.protocol === 'https:', uri.protocol);

// Cannot change href either
// @ts-expect-error readonly
guard(() => uri.href = 'ftp://download.org');
console.log(uri.toString());
console.assert(uri.href === 'https://example.com/?query#hash', uri.href);
console.assert(uri.origin === 'https://example.com', uri.origin);
console.assert(uri.protocol === 'https:', uri.protocol);

// Anything that doesn't mess with the protocol is allowed to change
uri.hostname = 'download.org';
uri.port = '8080';
uri.pathname = 'path';
uri.search = 'params';
uri.hash = 'fragment';
console.log(uri.toString());
console.assert(uri.href === 'https://download.org:8080/path?params#fragment', uri.href);
console.assert(uri.origin === 'https://download.org:8080', uri.origin);
console.assert(uri.host === 'download.org:8080', uri.host);
console.assert(uri.hostname === 'download.org', uri.hostname);

// Magic _href works
uri._href = 'http://wiki.net/docs?search#anchor';
console.log(uri.toString());
console.assert(uri.href === 'http://wiki.net/docs?search#anchor', uri.href);
console.assert(uri.origin === 'http://wiki.net', uri.origin);
console.assert(uri.protocol === 'http:', uri.protocol);
