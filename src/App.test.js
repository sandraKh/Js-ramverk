
import React from 'react';
import App from './App.js';
import {BrowserRouter} from 'react-router-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import SavedDocs from './SavedDocs';

const renderPage = (ui, {route = '/'} = {}) => {
    window.history.pushState({}, 'Test page', route);

    return render(ui, {wrapper: BrowserRouter});
};

test('renders navbar with correct text', () => {
    renderPage(<App/>);
    const navElement = screen.getByText('Sandras Editor för JS-ramverk');

    expect(navElement).toBeInTheDocument();
});

test('Clicking on a document will reder the editor', () => {
    renderPage(<App/>);
    fireEvent.click(screen.getByText('Create New Document'));
    expect(screen.getByText('Show All Documents')).toBeInTheDocument();
    expect(screen.getByText('New Document')).toBeInTheDocument();
});

test('Clicking on "Show All Documents will render the view with all documents', () => {
    renderPage(<App/>, {route: '/editor'});
    fireEvent.click(screen.getByText('Show All Documents'));
    expect(screen.getByText('Create New Document')).toBeInTheDocument();
});

test('Checks if my custom buttons are added to the toolbar', () => {
    renderPage(<App/>, {route: '/editor'});

    const saveBtn = screen.getByRole('button', {name: /saveBtn/i})
    const deleteBtn = screen.getByRole('button', {name: /deleteBtn/i})

    expect(saveBtn).toBeInTheDocument();
    expect(deleteBtn).toBeInTheDocument();


})