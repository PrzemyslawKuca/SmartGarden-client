import React, {useEffect, useState} from "react";
import {useMutation, useQuery} from "@apollo/client";
import {DELETE_PLAN, GET_PLANS, GET_SETTINGS, UPDATE_SETTINGS} from "../helpers/gqlQueries";
import {Form as BootstrapForm} from "react-bootstrap";
import {BsFillLightbulbFill, FaTemperatureHigh, GiPlantRoots, WiHumidity} from "react-icons/all";

const CreatePlan = () => {
    const [limit, setLimit] = useState(5)
    const [offset, setOffset] = useState(0)
    const [plansData, setPlansData] = useState(0)

    const {data, loading, error, refetch} = useQuery(GET_PLANS, {variables: {limit: limit, offset: offset}});
    const [deletePlan, {loading: loadingDeletePlan, error: ErrorDeletePlan}] = useMutation(DELETE_PLAN);
    const {
        data: settings,
        loading: settingsLoading,
        error: settingsError,
        refetch: settingsRefeatch
    } = useQuery(GET_SETTINGS);
    const [updateSettings, {loading: loadingUpdateSettings, error: ErrorUpdateSettings}] = useMutation(UPDATE_SETTINGS);

    useEffect(() => {
        if (data) {
            setPlansData(data)
        }
    }, [data])

    const generatePagination = (totalItems, offset, limit) => {
        const totalPages = parseInt((totalItems / limit) + 1);
        const actualPage = (offset / limit) + 1;

        let pages;

        if (totalPages >= 3) {
            if (actualPage == 1) {
                pages = (
                    <>
                        <li className="page-item active"><span className="page-link">1</span></li>
                        <li className="page-item" onClick={() => {
                            if (plansData.profiles.hasMore) {
                                setOffset(offset + limit)
                            }
                        }}><span className="page-link">2</span></li>
                        <li className="page-item" onClick={() => {
                            if (plansData.profiles.hasMore) {
                                setOffset(offset + (2 * limit))
                            }
                        }}><span className="page-link">3</span></li>
                    </>
                )
            } else if (actualPage === totalPages) {
                pages = (
                    <>
                        <li className="page-item" onClick={() => {
                            if (offset > 0) {
                                setOffset(offset - (2 * limit))
                            }
                        }}><span className="page-link">{totalPages - 2}</span></li>
                        <li className="page-item" onClick={() => {
                            if (offset > 0) {
                                setOffset(offset - limit)
                            }
                        }}><span className="page-link">{totalPages - 1}</span></li>
                        <li className="page-item active"><span className="page-link">{totalPages}</span></li>
                    </>
                )
            } else {
                pages = (
                    <>
                        <li className="page-item" onClick={() => {
                            if (offset > 0) {
                                setOffset(offset - limit)
                            }
                        }}><span className="page-link">{actualPage - 1}</span></li>
                        <li className="page-item active"><span className="page-link">{actualPage}</span></li>
                        <li className="page-item" onClick={() => {
                            if (plansData.profiles.hasMore) {
                                setOffset(offset + limit)
                            }
                        }}><span className="page-link">{actualPage + 1}</span></li>
                    </>
                )
            }
        }

        return (<nav aria-label="Page navigation example">
            <ul className="pagination">

                <li className={offset == 0 ? 'page-item disabled' : 'page-item'} onClick={() => {
                    if (offset > 0) {
                        setOffset(offset - limit)
                    }
                }}><span className="page-link">Poprzednia</span></li>
                {pages}
                <li className={!plansData.profiles.hasMore ? 'page-item disabled': 'page-item'} onClick={() => {
                    if (plansData.profiles.hasMore) {
                        setOffset(offset + limit)
                    }
                }}><span className="page-link">Następna</span></li>
            </ul>
        </nav>)
    }

    return (
        <>
            {plansData && plansData.profiles.profiles.map((plan, index) => {
                return (<div key={index} className="accordion-item">
                    <h2 className="accordion-header" id="flush-headingOne">
                        <BootstrapForm.Check
                            style={{position: 'absolute', zIndex: 100, marginLeft: 15}}
                            type="radio"
                            checked={settings && settings.settings.current_plan === plan.id}
                            onChange={() => {
                                updateSettings({
                                    variables: {
                                        current_plan: plan.id
                                    }
                                }).then(() => {
                                    settingsRefeatch()
                                })
                            }}
                        />
                        <button className="accordion-button collapsed button-title" type="button"
                                style={{paddingLeft: 65}}
                                data-bs-toggle="collapse" data-bs-target={'#index' + index}
                                aria-expanded="false" aria-controls="flush-collapseTwo">
                            {plan.name}
                        </button>
                    </h2>
                    <div id={'index' + index} className="accordion-collapse collapse"
                         aria-labelledby="headingOne"
                         data-bs-parent="#accordionExample">
                        <div className="accordion-body">
                            <ul className="list-group">
                                {
                                    plan.schedule.map((schedule, index) => {
                                        return (
                                            <li key={index}
                                                className="list-group-item d-flex justify-content-between align-items-start">
                            <span>
                            <FaTemperatureHigh/><span style={{
                                marginLeft: '0.5em',
                                marginRight: '1em'
                            }}>{schedule.air_temperature}</span>
                            <WiHumidity/><span style={{
                                marginLeft: '0.5em',
                                marginRight: '1em'
                            }}>{schedule.air_humidity}%</span>
                            <GiPlantRoots/><span style={{
                                marginLeft: '0.5em',
                                marginRight: '1em'
                            }}>{schedule.soil_humidity}%</span>
                            <BsFillLightbulbFill/><span style={{
                                marginLeft: '0.5em',
                                marginRight: '1em'
                            }}>{schedule.light.start_hour}-{schedule.light.end_hour}</span>

                            </span>
                                                <span
                                                    className="small">{schedule.duration} dni</span>
                                            </li>
                                        )
                                    })
                                }
                            </ul>
                            <div className={'button-wrapper mt-3'}>
                                <button type="button" className="btn btn-sm btn-danger"
                                        onClick={() => deletePlan({variables: {id: plan.id}}).then(() => refetch())}>Usuń
                                </button>
                            </div>
                        </div>
                    </div>
                </div>)
            })
            }
            <div className={'mt-3'}>
                {plansData && generatePagination(plansData.profiles.totalLength, offset, limit)}
            </div>
        </>
    )
}

export default CreatePlan;