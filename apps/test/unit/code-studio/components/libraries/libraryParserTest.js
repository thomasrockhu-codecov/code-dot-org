import {expect} from '../../../../util/reconfiguredChai';
import parser from '@cdo/apps/code-studio/components/libraries/libraryParser';

describe('Library parser', () => {
  describe('sanitizeName', () => {
    it('removes whitespace', () => {
      let libraryName = 'Test Library\t\r\n\fName';
      expect(parser.sanitizeName(libraryName)).to.equal('TestLibraryName');
    });

    it('removes non alphanumeric characters', () => {
      let libraryName = 'Test`~!Library🙃💩Name123';
      expect(parser.sanitizeName(libraryName)).to.equal('TestLibraryName123');
    });

    it('capitalizes the first letter of a library', () => {
      let libraryName = 'testLibrary';
      expect(parser.sanitizeName(libraryName)).to.equal('TestLibrary');
    });

    it('prepends Lib to the beginning of a library starting with a number', () => {
      let libraryName = '123testLibrary';
      expect(parser.sanitizeName(libraryName)).to.equal('Lib123testLibrary');
    });

    it('names an empty library "Lib"', () => {
      let libraryName = '';
      expect(parser.sanitizeName(libraryName)).to.equal('Lib');
    });
  });

  describe('createLibraryJson', () => {
    let emptyCode = '';
    let emptyFunctions = [];
    let emptyLibraryName = 'emptyLibrary';
    let emptyDescription = '';

    it('can create an empty library', () => {
      expect(
        parser.createLibraryJson(
          emptyCode,
          emptyFunctions,
          emptyLibraryName,
          emptyDescription
        )
      ).to.equal(
        JSON.stringify({
          name: emptyLibraryName,
          description: emptyDescription,
          dropletConfig: [],
          source: emptyCode
        })
      );
    });

    describe('will return early', () => {
      it('when no library name is passed', () => {
        expect(
          parser.createLibraryJson(
            emptyCode,
            emptyFunctions,
            undefined,
            emptyDescription
          )
        ).to.equal(undefined);
      });

      it('when the library name is empty', () => {
        expect(
          parser.createLibraryJson(
            emptyCode,
            emptyFunctions,
            '',
            emptyDescription
          )
        ).to.equal(undefined);
      });

      it('when no code is passed', () => {
        expect(
          parser.createLibraryJson(
            undefined,
            emptyFunctions,
            emptyLibraryName,
            emptyDescription
          )
        ).to.equal(undefined);
      });

      it('when functions are not passed as an array', () => {
        expect(
          parser.createLibraryJson(
            emptyCode,
            '',
            emptyLibraryName,
            emptyDescription
          )
        ).to.equal(undefined);
      });

      it("when a function doesn't have a name", () => {
        let selectedFunctions = [{functionName: 'name'}, {foo: 'bar'}];
        expect(
          parser.createLibraryJson(
            emptyCode,
            selectedFunctions,
            emptyLibraryName,
            emptyDescription
          )
        ).to.equal(undefined);
      });

      it('when no description is passed', () => {
        expect(
          parser.createLibraryJson(
            emptyCode,
            emptyFunctions,
            emptyLibraryName,
            undefined
          )
        ).to.equal(undefined);
      });
    });

    it('is able to parse functions with parameters', () => {
      let firstFunctionName = 'first';
      let secondFunctionName = 'second';
      let params = ['foo', 'bar'];
      let category = 'Functions';
      let selectedFunctions = [
        {
          functionName: firstFunctionName,
          parameters: params
        },
        {
          functionName: secondFunctionName
        }
      ];

      let expectedDropletConfig = [
        {
          func: firstFunctionName,
          category: category,
          params: params,
          paletteParams: params
        },
        {
          func: secondFunctionName,
          category: category
        }
      ];

      expect(
        parser.createLibraryJson(
          emptyCode,
          selectedFunctions,
          emptyLibraryName,
          emptyDescription
        )
      ).to.deep.equal(
        JSON.stringify({
          name: emptyLibraryName,
          description: emptyDescription,
          dropletConfig: expectedDropletConfig,
          source: emptyCode
        })
      );
    });
  });

  describe('prepareLibraryForImport', () => {
    let emptyCode = '';
    let emptyDropletConfig = [];
    let emptyLibraryName = 'emptyLibrary';

    function closureCreator(libraryName = '', code = '', functions = '') {
      return `var ${libraryName} = (function() {${code}; return {${functions}}})();`;
    }

    it('given a new name, renames the library', () => {
      let funcName1 = 'one';
      let funcName2 = 'two';
      let originalJson = JSON.stringify({
        name: emptyLibraryName,
        dropletConfig: [{func: funcName1}, {func: funcName2}],
        source: emptyCode
      });

      let newName = 'newName';
      let newJson = parser.prepareLibraryForImport(originalJson, newName);
      expect(newJson).to.deep.equal({
        name: newName,
        originalName: emptyLibraryName,
        dropletConfig: [
          {func: `${newName}.${funcName1}`},
          {func: `${newName}.${funcName2}`}
        ],
        source: closureCreator(
          newName,
          emptyCode,
          `${funcName1}: ${funcName1},${funcName2}: ${funcName2}`
        )
      });
    });

    it('is able to parse code with quotes', () => {
      let code = '`"\'';
      let originalJson = JSON.stringify({
        name: emptyLibraryName,
        dropletConfig: emptyDropletConfig,
        source: code
      });
      let newJson = parser.prepareLibraryForImport(originalJson);
      expect(newJson).to.deep.equal({
        name: emptyLibraryName,
        originalName: emptyLibraryName,
        dropletConfig: emptyDropletConfig,
        source: closureCreator(emptyLibraryName, code)
      });
    });
  });
});
