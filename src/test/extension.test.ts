import * as assert from 'assert';

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import { ExtensionContext, commands, window, TextEditor, TextDocument, workspace } from 'vscode';
import{ activate } from '../extension';
import { before, beforeEach, afterEach } from 'mocha';
import { SinonSandbox, SinonSpy, createSandbox } from 'sinon';

suite('Extension Test Suite', () => {
	let sandbox: SinonSandbox;
	const context: Partial<ExtensionContext> = ({
		subscriptions: [],
	});
	const mockWorkspace = workspace as any;
	const mockWindow = window as any;
	const mockTextEditor: TextEditor = {
		document: {
			fileName: ''
		} as TextDocument
	} as TextEditor;
	let openedFile: string;
	let findFilesSpy: SinonSpy;
	const exclude = null;
	const maxResults = 1;

	before(()=>{
		activate(context as ExtensionContext);
	});

	beforeEach(()=>{
		sandbox = createSandbox();
		sandbox.stub(mockTextEditor.document, 'fileName').get(() => openedFile);
		sandbox.stub(mockWindow, 'activeTextEditor').get(()=>mockTextEditor);
		findFilesSpy = sandbox.spy(mockWorkspace, 'findFiles');
	});

	afterEach(() => {
    sandbox.restore();
  });

	test('JavaScript file', () => {
		openedFile = 'src/somefolder/someFile.js';
		const globPatternExpected = '**/someFile{Spec,Test,.spec,.test}.js';
		commands.executeCommand('extension.jumpToTheTest');
		assert.strictEqual(findFilesSpy.calledWith(globPatternExpected, exclude, maxResults), true);
	});

	test('JavaScript test file', () => {
		openedFile = 'src/somefolder/test/someFile.spec.js';
		const globPatternExpected = '**/someFile.{js,vue}';
		commands.executeCommand('extension.jumpToTheTest');
		assert.strictEqual(findFilesSpy.calledWith(globPatternExpected, exclude, maxResults), true);
	});

	test('TypeScript file', () => {
		openedFile = 'src/modules/transaction/transaction.service.ts';
		const globPatternExpected = '**/transaction.service{spec,test,.spec,.test}.ts';
		commands.executeCommand('extension.jumpToTheTest');
		assert.strictEqual(findFilesSpy.calledWith(globPatternExpected, exclude, maxResults), true);
	});

	test('TypeScript test file', () => {
		openedFile = 'tests/modules/transaction/transaction.service.test.ts';
		const globPatternExpected = '**/transaction.service.{ts,vue}';
		commands.executeCommand('extension.jumpToTheTest');
		assert.strictEqual(findFilesSpy.calledWith(globPatternExpected, exclude, maxResults), true);
	});

	test('Vue file', () => {
		openedFile = 'src/components/filter.vue';
		const globPatternExpected = '**/filter{spec,test,.spec,.test}.{ts,js}';
		commands.executeCommand('extension.jumpToTheTest');
		assert.strictEqual(findFilesSpy.calledWith(globPatternExpected, exclude, maxResults), true);
	});

	test('Ruby file', () => {
		openedFile = 'app/controllers/book_controller.rb';
		const globPatternExpected = '**/book_controller{_spec,_test,.spec,.test}.rb';
		commands.executeCommand('extension.jumpToTheTest');
		assert.strictEqual(findFilesSpy.calledWith(globPatternExpected, exclude, maxResults), true);
	});

	test('Ruby test file', () => {
		openedFile = 'spec/controllers/book_controller_spec.rb';
		const globPatternExpected = '**/book_controller.rb';
		commands.executeCommand('extension.jumpToTheTest');
		assert.strictEqual(findFilesSpy.calledWith(globPatternExpected, exclude, maxResults), true);
	});

	test('Rust file', () => {
		openedFile = 'src/abcdefgh/main-counter.rs';
		const globPatternExpected = '**/main-counter{-spec,-test,.spec,.test}.rs';
		commands.executeCommand('extension.jumpToTheTest');
		assert.strictEqual(findFilesSpy.calledWith(globPatternExpected, exclude, maxResults), true);
	});

	test('Rust test file', () => {
		openedFile = 'src/abcdefgh/main-counter-test.rs';
		const globPatternExpected = '**/main-counter.rs';
		commands.executeCommand('extension.jumpToTheTest');
		assert.strictEqual(findFilesSpy.calledWith(globPatternExpected, exclude, maxResults), true);
	});
});
