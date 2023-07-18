import React, { useState } from 'react';
import axios from 'axios';
import './Transferencias.css';

const TransferenciasView = () => {
    const [dataInicio, setDataInicio] = useState('');
    const [dataFim, setDataFim] = useState('');
    const [nomeOperador, setNomeOperador] = useState('');
    const [saldoPeriodo, setSaldoPeriodo] = useState('');
    const [saldo, setSaldo] = useState('');
    const [transferencias, setTransferencias] = useState([]);

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'numeric', day: 'numeric' };
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR', options);
    };

    function formatDateSql(date) {
        const parts = date.split('/');
        const day = parts[0];
        const month = parts[1];
        const year = parts[2];
        return `${year}-${month}-${day}`;
    }

    const handleDataInicioChange = (event) => {
        setDataInicio(event.target.value);
    };

    const handleDataFimChange = (event) => {
        setDataFim(event.target.value);
    };

    const handleNomeOperadorChange = (event) => {
        setNomeOperador(event.target.value);
    };

    const handlePesquisarClick = async () => {
        const dataInicioFormatted = dataInicio ? formatDateSql(dataInicio) : '';
        const dataFimFormatted = dataFim ? formatDateSql(dataFim) : '';

        const baseUrl = 'http://localhost:8080/transferencias/findAll';
        const params = new URLSearchParams();

        if (dataInicioFormatted) {
            params.append('dataInicio', encodeURIComponent(dataInicioFormatted));
        }

        if (dataFimFormatted) {
            params.append('dataFim', encodeURIComponent(dataFimFormatted));
        }
        if (nomeOperador) {
            params.append('nomeOperadorTransacao', encodeURIComponent(nomeOperador));
        }

        const url = `${baseUrl}?${params.toString()}`;

        try {
            const response = await axios.get(url);
            const { filtrosDTOList, saldo, saldoPeriodo } = response.data;
            setTransferencias(filtrosDTOList);
            setSaldo(saldo);
            setSaldoPeriodo(saldoPeriodo);
        } catch (error) {
            console.error(error);
            setTransferencias([]);
            setSaldo('');
            setSaldoPeriodo('');
        }
    };

    return (
        <div className="container">
            <h1>Transferências</h1>
            <div className="search-container">
                <div className="input-row">
                    <div className="form-group">
                        <label>Data de Início</label>
                        <input type="text" placeholder="Data de Início" value={dataInicio} onChange={handleDataInicioChange} />
                    </div>
                    <div className="form-group">
                        <label>Data de Fim</label>
                        <input type="text" placeholder="Data de Fim" value={dataFim} onChange={handleDataFimChange} />
                    </div>
                    <div className="form-group">
                        <label>Nome do Operador</label>
                        <input type="text" placeholder="Nome do Operador" value={nomeOperador} onChange={handleNomeOperadorChange} />
                    </div>
                </div>
                <div className="button-row">
                    <button className="btn btn-primary" onClick={handlePesquisarClick}>Pesquisar</button>
                </div>
            </div>
            <table className="transferencias-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Data de Transferência</th>
                        <th>Valor</th>
                        <th>Tipo</th>
                        <th>Nome do Operador</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><strong>Saldo Total:</strong></td>
                        <td>{saldo}</td>
                        <td></td>
                        <td><strong>Saldo do Período:</strong></td>
                        <td>{saldoPeriodo}</td>
                        <td></td>
                    </tr>
                    {transferencias.map((transferencia) => (
                        <tr key={transferencia.id}>
                            <td>{transferencia.id}</td>
                            <td>{formatDate(transferencia.dataTransferencia)}</td>
                            <td>{formatCurrency(transferencia.valor)}</td>
                            <td>{transferencia.tipo}</td>
                            <td>{transferencia.nomeOperadorTransacao}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default TransferenciasView;
