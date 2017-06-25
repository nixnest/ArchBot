/* eslint-env mocha */
/* global expect */
'use strict';

describe('sed', function () {
  const sed = require('../../commands/sed').test;

  describe('.codePointsFromString', function () {
    const func = sed.codePointsFromString || (x => x);
    it('handles an empty string', function () {
      expect(func('')).to.deep.equal([]);
    });
    it('handles a string without surrogate pairs', function () {
      expect(func('Hi!')).to.deep.equal([0x48, 0x69, 0x21]);
    });
    it('handles a string with surrogate pairs', function () {
      expect(func('😀🚀')).to.deep.equal([0x1f600, 0x1f680]);
    });
  });

  describe('.commandFunctions.substitute', function () {
    const func = sed.commandFunctions && sed.commandFunctions['s'] || (x => x);
    it('returns a function', function () {
      expect(func('a', 'b', 'i')).to.be.a('function');
    });
    it('does not throw if no flags are provided', function () {
      expect(function () { return func('a', 'b'); }).to.not.throw;
    });
  });

  describe('.commandFunctions.transliterate', function () {
    const func = sed.commandFunctions && sed.commandFunctions['y'] || (x => x);
    it('returns a function', function () {
      expect(func('a', 'b')).to.be.a('function');
    });
    it('maps characters from the source to the destination', function () {
      expect(func('abc', '123')('cab')).to.equal('312');
    });
    it('does not change characters not found in the source', function () {
      expect(func('abc', '123')('cat')).to.equal('31t');
    });
    it('ignores source characters that have no corresponding destination', function () {
      expect(func('ab', 'c')('ab')).to.equal('cb');
    });
    it('handles strings with surrogate pairs', function () {
      expect(func('X😀', '🚀Y')('X😀!')).to.equal('🚀Y!');
    });
  });

  describe('.commandsFromString', function () {
    const func = sed.commandsFromString || (x => x);
    it('handles an empty string', function () {
      expect(func('')).to.deep.equal([]);
    });
    it('parses a substitution of the form "s/pattern/replacement/flags"', function () {
      let subject = func('s/[ab]+/"$&"/i');
      expect(subject).to.be.an('array').with.lengthOf(1);
      expect(subject[0]).to.be.a('function');
      expect(subject[0]('Abaca')).to.equal('"Aba"ca');
    });
    it('parses a substitution of the form "pattern/replacement"', function () {
      let subject = func('[ab]+/"$&"');
      expect(subject).to.be.an('array').with.lengthOf(1);
      expect(subject[0]).to.be.a('function');
      expect(subject[0]('Abaca')).to.equal('A"ba"c"a"');
    });
    it('parses a transliteration of the form "y/source/destination/"', function () {
      let subject = func('y/abc/123/');
      expect(subject).to.be.an('array').with.lengthOf(1);
      expect(subject[0]).to.be.a('function');
      expect(subject[0]('Abaca')).to.equal('A2131');
    });
    it('parses multiple commands in a single string', function () {
      let subject = func('s/[ab]+/"$&"/i [ab]+/"$&" y/abc/123/');
      expect(subject).to.be.an('array').with.lengthOf(3);
    });
    it('supports custom separators with the new syntax', function () {
      let subject = func('s|[ab]+|/$&/|i');
      expect(subject).to.be.an('array').with.lengthOf(1);
      expect(subject[0]).to.be.a('function');
      expect(subject[0]('Abaca')).to.equal('/Aba/ca');
    });
    it('supports escapement with the old syntax', function () {
      let subject = func('\\\\\\\\/\\ \\/\\ ');
      expect(subject).to.be.an('array').with.lengthOf(1);
      expect(subject[0]).to.be.a('function');
      expect(subject[0]('a\\b')).to.equal('a / b');
    });
    it('ignores extraneous characters', function () {
      let subject = func('before abc/123 after');
      expect(subject).to.be.an('array').with.lengthOf(1);
      expect(subject[0]).to.be.a('function');
      expect(subject[0]('Labcoat')).to.equal('L123oat');
    });
  });

  describe('run', function () {
    const run = require('../../commands/sed').run;
    let input;
    beforeEach(function () {
      input = { embed: { description: 'Abaca' } };
    });

    it('does not throw when given bad regular expression patterns', function () {
      // NOTE: JavaScript does not support lookbehind.
      let subject = () => run(input, 's/(?<=a)b/c/');
      expect(subject).to.not.throw;
      expect(subject()).to.match(/invalid regular expression/i);
    });
    it('supports an array of arguments', function () {
      const args = ['s/[ab]+/"$&"/i', '[ab]+/"$&"', 'y/abc/123/'];
      expect(run(input, args)).to.have.deep.property('embed.description', '"A"21""3"1"');
    });
    it('modifies the description within the input object', function () {
      expect(input).to.have.deep.property('embed.description', 'Abaca');
      run(input, '(.)a/$1i');
      expect(input).to.have.deep.property('embed.description', 'Abici');
    });
    it('truncates output to 2048 characters', function () {
      const args = './$&$&$&$&$&$&$&$& ./$&$&$&$&$&$&$&$& ./$&$&$&$&$&$&$&$&';
      let subject = run(input, args).embed.description;
      expect(subject).to.have.lengthOf(2048);
    });
  });
});
